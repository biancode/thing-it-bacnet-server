import * as _ from 'lodash';

import { ApiError } from '../errors';

import { CSVRow } from './row.csv';

const CSVRowSeparator = String.fromCharCode(10);

export class CSVTable {
    private aliases: Map<string, number>;
    private rows: CSVRow[];

    constructor (strTable: string = '') {
        this.aliases = new Map();
        this.fromString(strTable);
    }

    /**
     * lenght - returns the lenght of the table.
     *
     * @return {number}
     */
    get lenght (): number {
        return this.rows.length;
    }

    /**
     * destroy - destroys the internal buffers.
     *
     * @return {void}
     */
    public destroy (): void {
    }

    /**
     * clear - clears the array with rows.
     *
     * @return {void}
     */
    public clear (): void {
        _.map(this.rows, (row) => {
            row.destroy();
        })
        this.rows = [];
        this.aliases.clear();
    }

    /**
     * setRowAlias - sets the alias to the specific row.
     *
     * @param  {number} cellNumber - cell ID
     * @param  {string} cellAlias - cell alias
     * @return {CSVRow}
     */
    public setRowAlias (rowNumber: number, rowAlias: string): CSVTable {
        if (this.aliases.has(rowAlias)) {
            throw new ApiError(`CSVTable - setRowAlias: Alias ${rowAlias} is already exist!`);
        }

        this.aliases.set(rowAlias, rowNumber);
        return this;
    }

    /**
     * getRowByIndex - returns the CSVRow instance by index row.
     *
     * @param  {number} index - index of the element
     * @return {CSVRow}
     */
    public getRowByIndex (index: number): CSVRow {
        return this.rows[index];
    }

    /**
     * getRowByIndex - returns the CSVRow instance by index row.
     *
     * @param  {number} index - index of the element
     * @return {CSVRow}
     */
    public getRowByAlias (alias: string): CSVRow {
        const rowIndex: number = this.aliases.get(alias);
        return this.rows[rowIndex];
    }

    /**
     * addRow - creates and returns the instance of CSVRow class.
     *
     * @return {CSVRow}
     */
    public addRow (alias?: string): CSVRow {
        const row = new CSVRow();
        const rowIndex = this.rows.length;
        this.rows.push(row);

        if (_.isString(alias) && alias) {
            this.setRowAlias(rowIndex, alias);
        }
        return row;
    }

    /**
     * fromString - parses the "Table" string (csv format) and creates an array
     * of "CSVRow"s from parsed data.
     *
     * @param  {string} strTable - string in csv format (table)
     * @return {void}
     */
    public fromString (strTable: string): void {
        if (!_.isString(strTable)) {
            throw new ApiError(`CSVRow - fromString: Input string must have string type!`);
        }

        if (!strTable) {
            this.rows = [];
            return;
        }

        const strRows = strTable.split(CSVRowSeparator)
            .filter((strRow) => strRow !== '');

        const formatedRows = _.map(strRows, (strRow) => {
            return new CSVRow(strRow);
        });

        this.rows = formatedRows;
    }

    /**
     * toString - returns the string representation (csv format) of the table.
     *
     * @return {string}
     */
    public toString (): string {
        const maxLength: number = _.reduce(this.rows, (max, cur) => {
            return max >= cur.size ? max : cur.size;
        }, 0);

        const rowString = _.map(this.rows, (row) => {
            return row.toString(maxLength);
        });
        return rowString.join('\r\n');
    }
}
