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