import React from 'react';

import DataTable from './components/DataTable.js';

import './assets/application.scss';

function App() {
  return (
    <div className='App'>
      <header className='App-header'></header>
      <DataTable />
    </div>
  );
}

export default App;
/*
import React from 'react';

const Card = ({ children }) => {
  return <div className='card'>{children}</div>;
};

const CardImage = ({ src, alt }) => {
  return <img src={src} alt={alt} className='card-image' />;
};

const CardContent = ({ children }) => {
  return <div className='card-content'>{children}</div>;
};

const CardActions = ({ children }) => {
  return <div className='card-actions'>{children}</div>;
};

const CompoundCard = () => {
  return (
    <Card>
      <CardImage
        src='https://bs-uploads.toptal.io/blackfish-uploads/public-files/Design-Patterns-in-React-Internal3-e0c0c2d0c56c53c2fcc48b2a060253c3.png'
        alt='Random Image'
      />
      <CardContent>
        <h2>Card Title</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </CardContent>
      <CardActions>
        <button>Like</button>
        <button>Share</button>
      </CardActions>
    </Card>
  );
};

export default CompoundCard;
*/
