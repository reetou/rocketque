import * as PIXI from 'pixi.js';
import { expect } from 'chai';
import {
	createRocket,
} from '../src/gameElements';

describe('Game', () => {

	it('should successfully create rocket', () => {
		const result = createRocket(1, 2);
		expect(result).to.not.Throw();
	})

})