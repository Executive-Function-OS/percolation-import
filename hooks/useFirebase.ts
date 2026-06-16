import { useState, useEffect, useCallback } from "react";
import { isFirebaseConfigured, auth, db } from "../lib/firebase";
import { signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { EngineAnalysis } from "../lib/research/types";

const LS_OPT_IN_PHENOTYPES = "efos_opt_in_phenotypes";
const LS_OPT_IN_VALIDATION = "efos_opt_in_validation";

export function useFirebase() {
  const [firebaseActive, setFirebaseActive] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [optInPhenotypes, setOptInPhenotypes] = useState(false);
  const [optInValidation, setOptInValidation] = useState(false);
  const [syncState, setSyncState] = useState<{
    status: "idle" | "syncing" | "success" | "error";
    message?: string;
  }>({ status: "idle" });

  // Initialize and check environment configuration
  useEffect(() => {
    const active = isFirebaseConfigured();
    setFirebaseActive(active);

    if (!active) {
      setLoading(false);
      return;
    }

    // Load local opt-in consent states
    setOptInPhenotypes(localStorage.getItem(LS_OPT_IN_PHENOTYPES) === "1");
    setOptInValidation(localStorage.getItem(LS_OPT_IN_VALIDATION) === "1");

    if (!auth) {
      setLoading(false);
      return;
    }

    const firebaseAuth = auth;

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        // Authenticate anonymously
        try {
          const credentials = await signInAnonymously(firebaseAuth);
          setUser(credentials.user);
        } catch (error) {
          console.error("Firebase Anonymous Auth failed:", error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const setConsentPhenotypes = useCallback((val: boolean) => {
    setOptInPhenotypes(val);
    if (val) localStorage.setItem(LS_OPT_IN_PHENOTYPES, "1");
    else localStorage.removeItem(LS_OPT_IN_PHENOTYPES);
  }, []);

  const setConsentValidation = useCallback((val: boolean) => {
    setOptInValidation(val);
    if (val) localStorage.setItem(LS_OPT_IN_VALIDATION, "1");
    else localStorage.removeItem(LS_OPT_IN_VALIDATION);
  }, []);

  // Save Phenotypes (strictly omitting PII or raw activity data)
  const saveAnonymizedPhenotype = useCallback(async (analysis: EngineAnalysis) => {
    if (!db || !user || !optInPhenotypes) return;

    setSyncState({ status: "syncing", message: "Syncing phenotype metrics..." });
    try {
      // Structure document to contain ONLY structured aggregate metrics
      const phenotypeDoc = {
        timestamp: serverTimestamp(),
        summary: {
          totalActivities: analysis.summary.totalActivities,
          uniqueFiles: analysis.summary.uniqueFiles,
          startDate: analysis.summary.startDate,
          endDate: analysis.summary.endDate,
          actionsPerDay: analysis.summary.actionsPerDay,
          dataQualityScore: analysis.summary.dataQualityScore,
        },
        dbscan: {
          epsUsed: analysis.dbscan.epsUsed,
          minSamples: analysis.dbscan.minSamples,
          noiseRatio: analysis.dbscan.noiseRatio,
          clusterCount: analysis.dbscan.clusterCount,
          silhouette: analysis.dbscan.silhouette,
        },
        network: {
          nodeCount: analysis.network.nodeCount,
          edgeCount: analysis.network.edgeCount,
          avgDegree: analysis.network.avgDegree,
          density: analysis.network.density,
          clusteringCoefficient: analysis.network.clusteringCoefficient,
          avgEdgeWeight: analysis.network.avgEdgeWeight,
          giantComponentFraction: analysis.network.giantComponentFraction,
        },
        percolation: {
          criticalThreshold: analysis.percolation.criticalThreshold,
          fragility: analysis.percolation.fragility,
          fragmentation: analysis.percolation.fragmentation,
        },
        classification: {
          systemType: analysis.classification.systemType,
          systemLabel: analysis.classification.systemLabel,
          chaosScore: analysis.classification.chaosScore,
          chaosMargin: analysis.classification.chaosMargin,
          coupling: analysis.classification.coupling,
          fragmentation: analysis.classification.fragmentation,
          spawningRate: analysis.classification.spawningRate,
          observerOperatorLagDays: analysis.classification.observerOperatorLagDays,
          observerOperatorNormalized: analysis.classification.observerOperatorNormalized,
        },
        distanceToPercolationThreshold: analysis.distanceToPercolationThreshold,
      };

      const phenotypesRef = collection(db, "users", user.uid, "phenotypes");
      await addDoc(phenotypesRef, phenotypeDoc);
      setSyncState({ status: "success", message: "Phenotype metrics synchronized!" });
    } catch (error) {
      console.error("Failed to save phenotype:", error);
      setSyncState({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to sync phenotypes.",
      });
    }
  }, [user, optInPhenotypes]);

  // Save Validation Outcomes
  const saveValidationOutcome = useCallback(async (
    crisisDates: string,
    validationSummary: { hits: number; total: number } | null
  ) => {
    if (!db || !user || !optInValidation) return;

    setSyncState({ status: "syncing", message: "Syncing validation outcomes..." });
    try {
      const parsedDates = crisisDates
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const validationDoc = {
        timestamp: serverTimestamp(),
        // completion_date is used for TTL checks by the backend scheduled cloud function
        completion_date: new Date().toISOString(),
        crisisDates: parsedDates,
        summary: validationSummary,
      };

      const validationRef = collection(db, "users", user.uid, "validation");
      await addDoc(validationRef, validationDoc);
      setSyncState({ status: "success", message: "Validation outcomes synchronized!" });
    } catch (error) {
      console.error("Failed to save validation:", error);
      setSyncState({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to sync validation outcomes.",
      });
    }
  }, [user, optInValidation]);

  // Submit Feedback
  const submitResearchFeedback = useCallback(async (email: string, note: string) => {
    if (!db || !user) {
      throw new Error("Firebase is not initialized or user is not logged in.");
    }

    const feedbackDoc = {
      timestamp: serverTimestamp(),
      email: email.trim(),
      note: note.trim(),
    };

    const feedbackRef = collection(db, "users", user.uid, "feedback");
    await addDoc(feedbackRef, feedbackDoc);
  }, [user]);

  return {
    firebaseActive,
    user,
    loading,
    optInPhenotypes,
    optInValidation,
    syncState,
    setConsentPhenotypes,
    setConsentValidation,
    saveAnonymizedPhenotype,
    saveValidationOutcome,
    submitResearchFeedback,
    setSyncState,
  };
}
