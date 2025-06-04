/* eslint-disable @typescript-eslint/no-explicit-any */
interface FunctionCallResponse {
  function_call: {
    name: string;
    arguments: any;
  };
}

interface GenerateProblemsRequest {
  topic: string;
  reference_question: string;
  num_questions: number;
}

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export async function generateProblems(
  topic: string,
  referenceQuestion: string,
  numQuestions: number
): Promise<FunctionCallResponse> {
  try {
    const response = await fetch(`${SERVER_URL}/api/ai/generate-problems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        reference_question: referenceQuestion,
        num_questions: numQuestions,
      } as GenerateProblemsRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating problems:', error);
    throw error;
  }
}