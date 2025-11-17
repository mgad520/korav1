import { useState, useEffect } from 'react';

export interface Question {
  id: string;
  title: string;
  choice: string[];
  choiceAnswer: number;
  questionNumbers: number;
  image?:string;
  chapterId?: string;
  _owner?: string;
  _createdDate?: string;
  _updatedDate?: string;
}

export interface QuestionSet {
  setNumber: number;
  questions: Question[];
}

export interface ApiResponse {
  sets: QuestionSet[];
}

export const useQuestions = () => {
  const [questions, setQuestions] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://dataapis.wixsite.com/kora/_functions/AllQuestionsDataInSets/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setQuestions(data.sets || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const refetch = () => {
    fetchQuestions();
  };

  return {
    questions,
    loading,
    error,
    refetch,
  };
};