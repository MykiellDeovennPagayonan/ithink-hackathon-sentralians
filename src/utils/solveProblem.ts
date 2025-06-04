/* eslint-disable @typescript-eslint/no-explicit-any */
interface FunctionCallResponse {
  function_call: {
    name: string;
    arguments: any;
  };
}

interface SolveProblemRequest {
  question: string;
  image_url?: string;
}

export async function solveProblem(
  question: string,
  imageUrl?: string
): Promise<FunctionCallResponse> {
  try {
    const requestBody: SolveProblemRequest = {
      question,
    };

    if (imageUrl) {
      requestBody.image_url = imageUrl;
    }

    const response = await fetch('/api/solve-problem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error solving problem:', error);
    throw error;
  }
}