import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { mockTransactions } from "../data/mockTransactions";

const LOCAL_STORAGE_KEY = "finance-dashboard-state-v1";

const defaultFilters = { search: "", type: "all", category: "all", month: "all" };
const defaultSort = { field: "date", direction: "desc" };

const initialState = {
  transactions: mockTransactions,
  filters: defaultFilters,
  sort: defaultSort,
  theme: "light"
};

function reducer(state, action) {
  switch (action.type) {
    case "addTransaction":
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case "updateTransaction":
      return {
        ...state,
        transactions: state.transactions.map((t) => (t.id === action.payload.id ? action.payload : t))
      };
    case "removeTransaction":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload)
      };
    case "setFilters":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "setSort":
      return { ...state, sort: { ...state.sort, ...action.payload } };
    case "setTheme":
      return { ...state, theme: action.payload };
    case "setTransactions":
      return { ...state, transactions: action.payload };
    default:
      return state;
  }
}

function loadInitialState() {
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    return {
      ...initialState,
      ...parsed,
      filters: { ...defaultFilters, ...(parsed.filters || {}) },
      sort: { ...defaultSort, ...(parsed.sort || {}) }
    };
  } catch {
    return initialState;
  }
}

const AppStateContext = createContext(undefined);

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  useEffect(() => {
    const { transactions, filters, sort, theme } = state;
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ transactions, filters, sort, theme })
    );
  }, [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  const value = useMemo(() => ({ ...state, dispatch }), [state]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error("useAppState must be used within AppStateProvider");
  return value;
}

