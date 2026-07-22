import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

const firebaseConfig = {
  databaseURL: 'https://codesync-fd195-default-rtdb.firebaseio.com',
};

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);

get(ref(rtdb, 'submission')).then((snapshot) => {
  console.log('submission:', snapshot.val());
}).catch(console.error);

get(ref(rtdb, '.submission')).then((snapshot) => {
  console.log('.submission:', snapshot.val());
}).catch(console.error);

get(ref(rtdb, 'submissions')).then((snapshot) => {
  console.log('submissions:', snapshot.val());
  process.exit(0);
}).catch(console.error);
