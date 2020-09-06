import {makeUnit, Unit} from '../src/unit';
import {expect} from 'chai';

type Temperature = {temperature: 1};
const Temperature: Temperature = {temperature: 1};

type Length = {length: 1};
const Length: Length = {length: 1};

type Frequency = {time: -1};
const Frequency: Frequency = {time: -1};

type Velocity = {length: 1, time: -1};
const Velocity: Velocity = {length: 1, time: -1};

describe('unit', () => {
 
  describe('Unit', () => {
    describe('scaled', () => {
      it('set correct scale', () => {
        const kelvin = makeUnit('K', Temperature);
        const rankine = kelvin.scaled('ºR', 1.8);

        expect(rankine.scale).to.equal(1.8);
        expect(rankine.offset).to.equal(0);
      });

      it('set correct offset', () => {
        const kelvin = makeUnit('K', Temperature);
        const celsius = kelvin.scaled('ºC', 1, -272.15);

        expect(celsius.scale).to.equal(1);
        expect(celsius.offset).to.equal(-272.15);
      });

      it('secondary scaled set correct scale', () => {
        const inches = makeUnit('in', Length);
        const feet = inches.scaled('ft', 12);
        const yards = feet.scaled('yd', 3);

        expect(yards.scale).to.equal(36);
      });

      it('secondary scaled set correct offset', () => {
        const kelvin = makeUnit('K', Temperature);
        const celsius = kelvin.scaled('ºC', 1, -273.15);
        const fahrenheit = celsius.scaled('ºF', 9/5, 32);

        expect(fahrenheit.scale).to.equal(9/5);
        expect(fahrenheit.offset).to.be.closeTo(-459.67, 0.001);
      });
    });

    describe('times', () => {
      it ('adds dimensions', () => {
        const meters = makeUnit('m', Length);
        const hertz = makeUnit('Hz', Frequency);

        const velocity: Unit<Velocity> = meters.times('m/s', hertz);
        expect(velocity.dimension).to.deep.equal({length: 1, time: -1});
      });

      it ('scales from the base unit if derived from scaled units', () => {
        const feet = makeUnit('m', Length).scaled('ft', 3.281);
        const bpm = makeUnit('Hz', Frequency).scaled('bpm', 60);

        const velocity: Unit<Velocity> = feet.times('f/m', bpm);
        expect(velocity.scale).to.be.closeTo(196.86, 0.01);
      });
    });
  });
});