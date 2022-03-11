const ChurnPreventionFromcocoroCron = require('../../cronjob/churn_prevention_fromcocoro');
const { FromcocoroChurnState, EfoMessageVariable, Variable } = require("../../model");
const moment = require('moment');

const SHOULD_CONTAIN = "SHOULD_CONTAIN";
const SHOULD_NOT_CONTAIN = "SHOULD_NOT_CONTAIN";

describe('fromcocoro', () => {
	const now = moment().hour(1).minutes(0).seconds(0);
	const twentyNineDaysAgo = now.clone().subtract(29, 'days');
	const thirtyDaysAgo = now.clone().subtract(30, 'days');
	const thirtyOneDaysAgo = now.clone().subtract(31, 'days');
	const sixtyDaysAgo = now.clone().subtract(60, 'days');
	const ninetyDaysAgo = now.clone().subtract(90, 'days');
	const handredTwentyDaysAgo = now.clone().subtract(120, 'days');

	const registerChurnStates = (churnStates) => {
		return Promise.all(churnStates.map(async (s, idx) => {
			s.contract_id = `${s.contract_id}_${idx}`;
			s.user_id = `${s.user_id}_${idx}`;
			await new FromcocoroChurnState(s).save();
		}));
	}

	const cron = new ChurnPreventionFromcocoroCron();

	beforeAll(async () => {
		jest.doMock("../../model", () => {
			return {};
		});


	});

	afterEach(async () => {
		await FromcocoroChurnState.deleteMany({});
	});

	it('findChurnStates が解約済みのレコードを返さない ', async () => {

		const churnStatuses = [
			{
				contract_id: SHOULD_NOT_CONTAIN,
				user_id: SHOULD_NOT_CONTAIN,
				executed_at: thirtyDaysAgo.toDate(),
				is_churned: true,
				is_suspend: false,
			},
			{
				contract_id: SHOULD_CONTAIN,
				user_id: SHOULD_CONTAIN,
				executed_at: thirtyDaysAgo.toDate(),
				is_churned: false,
				is_suspend: false,
			},
		]

		await registerChurnStates(churnStatuses);

		const statuses = await cron.findChurnStates()

		expect(statuses).toHaveLength(1);
		expect(statuses).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					is_churned: true,
				})
			])
		)
	});

	it('findChurnStates が 30日前に解約防止したレコードだけを返す', async () => {
		const cron = new ChurnPreventionFromcocoroCron();

		const churnStatuses = [
			{
				contract_id: SHOULD_NOT_CONTAIN,
				user_id: SHOULD_NOT_CONTAIN,
				executed_at: twentyNineDaysAgo.toDate(),
				is_churned: false,
				is_suspend: false,
			},
			{
				contract_id: SHOULD_CONTAIN,
				user_id: SHOULD_CONTAIN,
				executed_at: thirtyDaysAgo.toDate(),
				is_churned: false,
				is_suspend: false,
			},
			{
				contract_id: SHOULD_NOT_CONTAIN,
				user_id: SHOULD_NOT_CONTAIN,
				executed_at: thirtyOneDaysAgo.toDate(),
				is_churned: false,
				is_suspend: false,
			},
		]

		await registerChurnStates(churnStatuses);

		const statuses = await cron.findChurnStates()

		expect(statuses).toHaveLength(1);
		expect(statuses).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					contract_id: expect.stringMatching(`${SHOULD_CONTAIN}_\d*`),
				})
			])
		)
	});

	it('findChurnStates が 30日前に月次処理したレコードだけを返す', async () => {
		const cron = new ChurnPreventionFromcocoroCron();

		const churnStatuses = [
			{
				contract_id: SHOULD_NOT_CONTAIN,
				user_id: SHOULD_NOT_CONTAIN,
				executed_at: twentyNineDaysAgo.clone().subtract(30, 'days').toDate(),
				updated_at: twentyNineDaysAgo.toDate(),
				is_churned: false,
				is_suspend: false,
			},
			{
				contract_id: SHOULD_CONTAIN,
				user_id: SHOULD_CONTAIN,
				executed_at: sixtyDaysAgo.toDate(),
				updated_at: thirtyDaysAgo.toDate(),
				is_churned: false,
				is_suspend: false,
			},
			{
				contract_id: SHOULD_NOT_CONTAIN,
				user_id: SHOULD_NOT_CONTAIN,
				executed_at: thirtyOneDaysAgo.clone().subtract(30, 'days').toDate(),
				updated_at: thirtyOneDaysAgo.toDate(),
				is_churned: false,
				is_suspend: false,
			},
		]

		await registerChurnStates(churnStatuses);

		const statuses = await cron.findChurnStates()

		expect(statuses).toHaveLength(1);
		expect(statuses).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					contract_id: expect.stringMatching(`${SHOULD_CONTAIN}_\d*`),
				})
			])
		)
	});

	it('findChurnStates が 120日前に解約防止したレコードを返さない', async () => {
		const cron = new ChurnPreventionFromcocoroCron();

		const churnStatuses = [
			{
				contract_id: SHOULD_NOT_CONTAIN,
				user_id: SHOULD_NOT_CONTAIN,
				executed_at: handredTwentyDaysAgo.clone(),
				updated_at: thirtyDaysAgo.toDate(),
				is_churned: false,
				is_suspend: false,
			},
			{
				contract_id: SHOULD_CONTAIN,
				user_id: SHOULD_CONTAIN,
				executed_at: ninetyDaysAgo.clone(),
				updated_at: thirtyDaysAgo.toDate(),
				is_churned: false,
				is_suspend: false,
			},
		]

		await registerChurnStates(churnStatuses);

		const statuses = await cron.findChurnStates()

		expect(statuses).toHaveLength(1);
		expect(statuses).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					contract_id: expect.stringMatching(`${SHOULD_CONTAIN}_\d*`),
				})
			])
		)
	});
});



