/* eslint-disable @typescript-eslint/no-explicit-any */
interface FunctionCallResponse {
  function_call: {
    name: string;
    arguments: any;
  };
}

interface ValidateSolutionRequest {
  question: string;
  image_url: string;
}

export async function validateSolution(
  question: string,
  imageUrl: string
): Promise<FunctionCallResponse> {
  try {
    const response = await fetch('/api/validate-solution', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        image_url: imageUrl,
      } as ValidateSolutionRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error validating solution:', error);
    throw error;
  }
}