import { NULL } from "./evaluator";
import { ArrayObj, ErrorObj, IntegerObj, NullObj, Obj, ObjectType } from "./interfaces/object";

class Enviroment {
	#env: Map<string, Obj>;
	#parent: Enviroment | null;

	constructor(parent: Enviroment | null = null){
		this.#env = new Map<string, Obj>;
		this.#parent = parent;
	}

	public get(key: string): Obj | undefined{
		const obj = this.#env.get(key);
		if(!obj && this.#parent)
			return this.#parent.get(key);
		return obj;
	}

	public set(key: string, obj: Obj): Obj {
		this.#env.set(key, obj);
		return obj;
	}
}

const builtin_len = (...args: Obj[]): Obj => {
	if(args.length != 1){
		return ErrorObj.create("Invalid argument count `len` takes 1, got:", [String(args.length)]);
	}
	switch(args[0].type){
		case ObjectType.STRING_OBJ:
			return new IntegerObj(args[0].value.toString().length);
		case ObjectType.ARRAY_OBJ:
			return new IntegerObj((args[0] as ArrayObj).elements.length);
		default: 
			return ErrorObj.create("Unsupported argument to `len`, got:", [args[0].type])
	}
};

const builtin_first = (...args: Obj[]): Obj => {
	if(args.length != 1){
		return ErrorObj.create("Invalid argument count `first` takes 1, got:", [String(args.length)]);
	}
	if(!(args[0] instanceof ArrayObj))
		return ErrorObj.create("`first` accepts only arrays as argument, got:", [args[0].type])
	if(args[0].elements.length > 0)
		return args[0].elements[0];
	
	return NULL;
};

const builtin_last = (...args: Obj[]): Obj => {
	if(args.length != 1){
		return ErrorObj.create("Invalid argument count `last` takes 1, got:", [String(args.length)]);
	}
	if(!(args[0] instanceof ArrayObj))
		return ErrorObj.create("`last` accepts only arrays as argument, got:", [args[0].type])
	if(args[0].elements.length > 0)
		return args[0].elements[args[0].elements.length - 1];
	
		return NULL;
};

const builtin_rest = (...args: Obj[]): Obj => {
	if(args.length != 1){
		return ErrorObj.create("Invalid argument count `rest` takes 1, got:", [String(args.length)]);
	}
	if(!(args[0] instanceof ArrayObj))
		return ErrorObj.create("`rest` accepts only arrays as argument, got:", [args[0].type])
	if(args[0].elements.length > 0)
		return new ArrayObj(args[0].elements.slice(1));
	
		return NULL;
};

const builtin_print = (...args: Obj[]): Obj => {
	const strs = args.map(arg => arg.type === ObjectType.STRING_OBJ ? arg.stringify().slice(1, - 1) : arg.stringify());
	console.log(strs.join(" "));
	return NULL;
};

export {
	Enviroment, 
	builtin_first,
	builtin_last,
	builtin_len,
	builtin_print,
	builtin_rest,
}