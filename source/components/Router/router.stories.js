import { Router, Route, useRouter } from './index';
import StorageMock from './StorageMock';

export default {
  title: 'Components/Router',
  component: Router,
};

const storageMock = new StorageMock();

const Home = () => {
  const { navigator } = useRouter();

  const goToDetails = () => navigator.navigate('details');

  return (
    <div>
      <div>home</div>
      <button type="button" onClick={goToDetails}>
        go to Details
      </button>
    </div>
  );
};

const Details = () => {
  const { navigator } = useRouter();

  const goToHome = () => navigator.navigate('home');

  return (
    <div>
      <div>details</div>
      <button type="button" onClick={goToHome}>
        go to Home
      </button>
    </div>
  );
};

const Template = (args) => (
  <Router {...args} initialRouteName="home" storage={storageMock}>
    <Route name="home" component={Home} />
    <Route name="details" component={Details} />
  </Router>
);

export const Default = Template.bind({});
Default.args = {};
