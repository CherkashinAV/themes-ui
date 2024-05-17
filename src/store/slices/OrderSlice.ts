import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {LoginPayload, LoginResponse, authProvider} from '../../providers/auth';
import {parseJwt} from '../../utils';
import {JwtPayload} from '../../types';
import {themesProvider} from '../../providers/themes';
import XLSX from 'xlsx-js-style';

interface LoginState {
	isFetching: boolean,
	isSuccess: boolean,
	isError: boolean,
	errorMessage: string,
	uid: string
}

const initialState: LoginState = {
	isFetching: false,
	isSuccess: false,
	isError: false,
	errorMessage: '',
	uid: ''
}

export const getOrder = createAsyncThunk<void, number, {rejectValue: string}>(
	'order/get',
	async (ruleId: number, {rejectWithValue}) => {
		const orderData = await themesProvider.getOrderData(ruleId);
		
		if (!orderData.ok) {
			return rejectWithValue('Что-то пошло не так')
		}

		var wscols = [
			{wch:5},
			{wch:30},
			{wch:30},
			{wch:30},
			{wch:20}
		];

		const ws = XLSX.utils.aoa_to_sheet([[]]);
		const merges: any[] = [];
		XLSX.utils.sheet_add_aoa(ws, [ [
			'№ \nп/п',
			'Фамилия,\nимя, отчество,\nстудента' ,
			'Тема выпускной\nквалификационной\nработы',
			'Фамилия,\nимя, отчество\nруководителя\n(консультанта)',
			'Учебная степень,\nучебное звание,\nдолжность\nруководителя\n(консультатнта)'
		]], {origin: "A1"});
		XLSX.utils.sheet_add_aoa(ws, [ [1, 2, 3, 4, 5]], {origin: "A2"});

		let currentRow = 2;
		  
		for (const [groupName, users] of Object.entries(orderData.value)) {
			XLSX.utils.sheet_add_aoa(ws, [[`Учебная группа ${groupName}`, '', '', '', '']], {origin: `A${currentRow}`});
			merges.push({s: {r: currentRow - 1, c: 0}, e: {r: currentRow - 1, c: 4}});
			currentRow++;
			for (let i = 0; i < users.length; i++) {
				XLSX.utils.sheet_add_aoa(ws, [[
					i + 1,
					users[i].executorName,
					users[i].themeTitle,
					users[i].head.name,
					users[i].head.post
				]], {origin: `A${currentRow}`});
				currentRow++;
			}
		}

		const wb = XLSX.utils.book_new();

		ws['!merges'] = merges;
		ws['!cols'] = wscols;
		ws['!rows'] = [{hpt: 70}];

		for (const i in ws) {
			if (typeof(ws[i]) != "object") continue;
		
			ws[i].s = { // styling for all cells
				font: {
					name: "Times New Roman"
				},
				alignment: {
					vertical: "center",
					horizontal: "center",
					wrapText: '1', // any truthy value here
				},
				border: {
					right: {
						style: "thin",
						color: "000000"
					},
					left: {
						style: "thin",
						color: "000000"
					},
					top: {
						style: "thin",
						color: "000000"
					},
					bottom: {
						style: "thin",
						color: "000000"
					}
				}
			};
		}

		XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
		XLSX.writeFile(wb, "Table.xlsx");

		return;
	}
)

const orderSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {
		clearState(state) {
			state.isError = false;
			state.isSuccess = false;
			state.isFetching = false;

			return state;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(getOrder.rejected, (state, {payload}) => {
				if (payload) {
					state.errorMessage = payload;
				}
				state.isFetching = false;
				state.isError = true;
			})
			.addCase(getOrder.pending, (state) => {
				state.isFetching = true
			})
			.addCase(getOrder.fulfilled, (state, {payload}) => {
				state.isFetching = false;
				state.isSuccess = true;

				return state;
			});
	}
});

export const {clearState} = orderSlice.actions;

export default orderSlice.reducer;
