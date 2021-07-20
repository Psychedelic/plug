import useApps from './useApps';

const useActivity = (transactions) => {
  const { parsedApps } = useApps();

  const sortActivity = () => {
    const unsortedActivity = [...transactions, ...parsedApps];
    return unsortedActivity.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  };

  return sortActivity();
};

export default useActivity;
