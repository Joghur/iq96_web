/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import 'dotenv/config';
// import styled from 'styled-components';
import Header from './components/Header';
import { Pdfs } from './components/Pdfs';
// import { Users } from './screens/Users';

// const Block = styled.div`
//   background-color: white;
//   &:hover {
//     background-color: lightblue;
//   }
// `;

// const BoldBlock = styled(Block)`
//   font-weight: bold;
//   border: 3px solid ${({ color }) => color || 'blue'};
//   padding: 10px;
// `;

const App = () => {
  return (
    <div className="App">
      <Header />
      {/* <Block>Hejsa</Block> */}
      {/* <BoldBlock>Hej igen</BoldBlock> */}
      {/* <Users /> */}
      <div>
        {/* <iframe
          width="1165"
          height="655"
          title="iq96"
          src={process.env.IQ_URL}
        /> */}
      </div>
      <Pdfs />
    </div>
  );
};

export default App;
