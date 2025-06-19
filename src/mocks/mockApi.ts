import report1 from './report1.json';
import report2 from './report2.json';
import report3 from './report3.json';

const reports = [report1, report2, report3];

const simulateNetworkDelay = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

export const uploadImages = async (formData: FormData) => {
  await simulateNetworkDelay(2000);

  const randomReport = reports[(Math.floor(Math.random() * reports.length))];

  return {task_id: randomReport.id}
};

export const submitSurveyApi = async (taskId: string, surveyData: {survey: any}) => {
  await simulateNetworkDelay(2000);

  const report = reports.find(r => r.id === taskId);

  if (!report) throw new Error('Report not found');
  
  if(surveyData.survey.childName) {
    report.childName = surveyData.survey.childName
  };

  return { succes: true };
};

export const checkReportStatus = async (taskId: string) => {
  await simulateNetworkDelay(5000);
  
  const report = reports.find(r => r.id === taskId);
  if (!report) throw new Error('Report not found');
  
  console.log(report);
  return {
    status: 'ready',
    report: report
  };
};