const API_URL = 'https://sirius-draw-test-94500a1b4a2f.herokuapp.com';

export const uploadImages = async (formData: FormData) => {
  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const submitSurvey = async (taskId: string, answers: Record<string, any>) => {
  const response = await fetch(`${API_URL}/submit-survey`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      task_id: taskId,
      answers,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const checkReportStatus = async (taskId: string) => {
  const response = await fetch(`${API_URL}/report/${taskId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};