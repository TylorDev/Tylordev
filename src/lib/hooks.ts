import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  fetchArticle,
  fetchArticles,
  fetchPage,
  fetchProject,
  fetchProjects,
  mapArticle,
  mapProject,
} from "./api";
import type { Article, Project } from "./types";

interface AsyncState<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}

export function usePage<T>(name: string): AsyncState<T | null> {
  const { language } = useLanguage();
  const [state, setState] = useState<AsyncState<T | null>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchPage<T>(language, name)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error: err });
      });
    return () => {
      cancelled = true;
    };
  }, [language, name]);

  return state;
}

export function useProjects(): AsyncState<Project[]> {
  const { language } = useLanguage();
  const [state, setState] = useState<AsyncState<Project[]>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchProjects(ctrl.signal)
      .then((list) =>
        setState({
          data: list.map((p) => mapProject(p, language)),
          loading: false,
          error: null,
        })
      )
      .catch((err: Error) => {
        if (err.name !== "AbortError") setState({ data: [], loading: false, error: err });
      });
    return () => ctrl.abort();
  }, [language]);

  return state;
}

export function useArticles(): AsyncState<Article[]> {
  const { language } = useLanguage();
  const [state, setState] = useState<AsyncState<Article[]>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchArticles(ctrl.signal)
      .then((list) =>
        setState({
          data: list.map((a) => mapArticle(a, language)),
          loading: false,
          error: null,
        })
      )
      .catch((err: Error) => {
        if (err.name !== "AbortError") setState({ data: [], loading: false, error: err });
      });
    return () => ctrl.abort();
  }, [language]);

  return state;
}

export function useProject(slug: string | undefined): AsyncState<Project | null> {
  const { language } = useLanguage();
  const [state, setState] = useState<AsyncState<Project | null>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!slug) return;
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchProject(slug, ctrl.signal)
      .then((p) => setState({ data: mapProject(p, language), loading: false, error: null }))
      .catch((err: Error) => {
        if (err.name !== "AbortError") setState({ data: null, loading: false, error: err });
      });
    return () => ctrl.abort();
  }, [slug, language]);

  return state;
}

export function useArticle(slug: string | undefined): AsyncState<Article | null> {
  const { language } = useLanguage();
  const [state, setState] = useState<AsyncState<Article | null>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!slug) return;
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchArticle(slug, ctrl.signal)
      .then((a) => setState({ data: mapArticle(a, language), loading: false, error: null }))
      .catch((err: Error) => {
        if (err.name !== "AbortError") setState({ data: null, loading: false, error: err });
      });
    return () => ctrl.abort();
  }, [slug, language]);

  return state;
}
