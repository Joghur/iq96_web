/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Header from './components/Header';
// import { Pdfs } from './components/Pdfs';
import { Users } from './screens/Users';
import { IFRAME_URL } from './constants';

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
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const pdfOnlyMode = params.get('pdfonly');
  return (
    <>
      <div>
        {!pdfOnlyMode && <Header />}
        {/* <Block>Hejsa</Block> */}
        {/* <BoldBlock>Hej igen</BoldBlock> */}
        <Users />
      </div>
      <div>
        <iframe width="1165" height="655" title="iframe" src={IFRAME_URL} />
        {/* <Pdfs /> */}
      </div>
    </>
  );
};

export default App;
