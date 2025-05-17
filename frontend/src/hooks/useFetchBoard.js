// src/hooks/useFetchBoard.js
import { useState, useEffect } from "react";
import { fetchBoard } from "../services/api";

export function useFetchBoard() {
  const [columns, setColumns] = useState({});

  useEffect(() => {
    let isMounted = true;
    fetchBoard()
      .then((data) => {
        if (isMounted) setColumns(data.columns);
      })
      .catch(console.error);
    return () => {
      isMounted = false;
    };
  }, []);

  return [columns, setColumns];
}
