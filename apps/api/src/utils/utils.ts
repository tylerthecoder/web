
export class Cache<T> {

	private _value: T | null = null;

	private setTime: number;

	constructor(
		private readonly ttl: number
	) {
		this.setTime = Date.now();
	}

	public get value(): T | null {
		const aliveTime = Date.now() - this.setTime;
		const isAlive = aliveTime < this.ttl;
		if (!isAlive) {
			this._value = null;
		}
		return this._value;
	}

	public set value(value: T | null) {
		this.value = value;
		this.setTime = Date.now();
	}
}