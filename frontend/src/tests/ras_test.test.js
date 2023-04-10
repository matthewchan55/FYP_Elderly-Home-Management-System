const ras = require('./ras_test')


test('calculateBalance: calculate balance and not return 300', () => {
    expect(ras.calculateBalance(100, 200)).not.toBe(300)
})

test('calculateBalance: calculate balance and return string', () => {
    expect(ras.calculateBalance(6130, 80)).toMatch("6050.00")
})

test('sumUpColumns: sum up columns of charge = 6130', () => {
    const items = [{charge:50, payment:50}, {charge:80, payment:30}, {charge:6000, payment:0}]

    expect(ras.sumUpColumns(items, "charge")).toBe(6130)
})
test('sumUpColumns: sum up columns of payment = 3670', () => {
    const items = [{charge:50, payment:50}, {charge:80, payment:30}, {charge:6000, payment:3590}]

    expect(ras.sumUpColumns(items, "payment")).toBe(3670)
})

test('string Date: string only date', () => {
    expect(ras.stringDate("2023-03-31T15:59:59.747+00:00", "date")).toMatch("31-03-2023")
})

test('string Date: string with date and time', () => {
    expect(ras.stringDate("2023-03-31T15:59:59.747+00:00", "dateTime")).toMatch("31-03-2023 23:59")
})

test('string Date: string with no date', () => {
    expect(ras.stringDate("", "dateTime")).toMatch("N/A")
})

test('format Date: tolocalestring Apr 2023', () => {
  const today = new Date();
  expect(ras.formatDate(today)).toMatch("Apr 2023")
})


