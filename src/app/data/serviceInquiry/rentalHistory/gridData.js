const rentalHistory = [
  {
    deviceId: 'T00001',
    stationName: '강남역 3번출구',
    userName: '홍길동',
    phone: '010-0000-0000',
    carNumber: '010-0000-0000',
    lastRental1: 'LG00001(40%)',
    lastRental2: 'LG00001(40%)',
    batteryReutrn1: 'LG00001(40%)',
    batteryReutrn2: 'LG00001(40%)',
    batteryRental1: 'LG00001(40%)',
    batteryRental2: 'LG00001(40%)',
    result: '성공',
    usedPoint: '5000p',
    updateTime: '2021-10-12 11:00.000',
    transaction: '16502065649849',
  },
  {
    deviceId: 'T00002',
    stationName: '강남역 3번출구',
    userName: '홍길동',
    phone: '010-0000-0000',
    carNumber: '010-0000-0000',
    lastRental1: 'LG00001(40%)',
    lastRental2: 'LG00001(40%)',
    batteryReutrn1: 'LG00001(40%)',
    batteryReutrn2: 'LG00001(40%)',
    batteryRental1: 'LG00001(40%)',
    batteryRental2: 'LG00001(40%)',
    result: '성공',
    usedPoint: '5000p',
    updateTime: '2021-10-12 11:00.000',
    transaction: '21321421421449',
  },
  {
    deviceId: 'T00003',
    stationName: '강남역 3번출구',
    userName: '홍길동',
    phone: '010-0000-0000',
    carNumber: '010-0000-0000',
    lastRental1: 'LG00001(40%)',
    lastRental2: 'LG00001(40%)',
    batteryReutrn1: 'LG00001(40%)',
    batteryReutrn2: 'LG00001(40%)',
    batteryRental1: 'LG00001(40%)',
    batteryRental2: 'LG00001(40%)',
    result: '성공',
    usedPoint: '5000p',
    updateTime: '2021-10-12 11:00.000',
    transaction: '8912303254645616',
  },
];
const gridColumn = [
  { name: '디바이스 ID', id: 'deviceId' },
  { name: 'Transaction ID', id: 'transaction' },
  { name: '스테이션명', id: 'stationName' },
  { name: '고객명', id: 'userName' },
  { name: '고객연락처', id: 'phone' },
  { name: '차량고유번호', id: 'carNumber' },
  { name: '마지막 대여1', id: 'lastRental1' },
  { name: '마지막 대여2', id: 'lastRental1' },
  { name: '배터리 반납1', id: 'batteryReutrn1' },
  { name: '배터리 반납2', id: 'batteryReutrn2' },
  { name: '배터리 대여1', id: 'batteryRental1' },
  { name: '배터리 대여2', id: 'batteryRental2' },
  { name: '결과', id: 'result' },
  { name: '사용포인트', id: 'usedPoint' },
  { name: '변경일시', id: 'updateTime' },
];
export { rentalHistory, gridColumn };
