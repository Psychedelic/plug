import useApps from './useApps';

const useActivity = (transactions = []) => {
  const { historicApps = [] } = useApps();

  const sortActivity = () => {
    const unsortedActivity = [...transactions, ...historicApps];
    return unsortedActivity.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  };

  return sortActivity();
};

export default useActivity;
