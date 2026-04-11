
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Question
 * 
 */
export type Question = $Result.DefaultSelection<Prisma.$QuestionPayload>
/**
 * Model ExamAttempt
 * 
 */
export type ExamAttempt = $Result.DefaultSelection<Prisma.$ExamAttemptPayload>
/**
 * Model ExamAnswer
 * 
 */
export type ExamAnswer = $Result.DefaultSelection<Prisma.$ExamAnswerPayload>
/**
 * Model ChatSession
 * 
 */
export type ChatSession = $Result.DefaultSelection<Prisma.$ChatSessionPayload>
/**
 * Model ChatMessage
 * 
 */
export type ChatMessage = $Result.DefaultSelection<Prisma.$ChatMessagePayload>
/**
 * Model KnowledgeChunk
 * 
 */
export type KnowledgeChunk = $Result.DefaultSelection<Prisma.$KnowledgeChunkPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const Topic: {
  LIMITS_AND_CONTINUITY: 'LIMITS_AND_CONTINUITY',
  DERIVATIVES: 'DERIVATIVES',
  INTEGRALS: 'INTEGRALS',
  COMPLEX_NUMBERS: 'COMPLEX_NUMBERS',
  VOLUMES: 'VOLUMES',
  COMBINATORICS_PROBABILITY: 'COMBINATORICS_PROBABILITY',
  SEQUENCES: 'SEQUENCES',
  EXPONENTIAL_LOGARITHM: 'EXPONENTIAL_LOGARITHM',
  FUNCTION_ANALYSIS: 'FUNCTION_ANALYSIS',
  ANALYTIC_GEOMETRY: 'ANALYTIC_GEOMETRY',
  SOLID_GEOMETRY: 'SOLID_GEOMETRY'
};

export type Topic = (typeof Topic)[keyof typeof Topic]


export const Difficulty: {
  RECOGNITION: 'RECOGNITION',
  COMPREHENSION: 'COMPREHENSION',
  APPLICATION: 'APPLICATION',
  ADVANCED: 'ADVANCED'
};

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty]


export const MessageRole: {
  user: 'user',
  assistant: 'assistant'
};

export type MessageRole = (typeof MessageRole)[keyof typeof MessageRole]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type Topic = $Enums.Topic

export const Topic: typeof $Enums.Topic

export type Difficulty = $Enums.Difficulty

export const Difficulty: typeof $Enums.Difficulty

export type MessageRole = $Enums.MessageRole

export const MessageRole: typeof $Enums.MessageRole

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.question`: Exposes CRUD operations for the **Question** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Questions
    * const questions = await prisma.question.findMany()
    * ```
    */
  get question(): Prisma.QuestionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.examAttempt`: Exposes CRUD operations for the **ExamAttempt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExamAttempts
    * const examAttempts = await prisma.examAttempt.findMany()
    * ```
    */
  get examAttempt(): Prisma.ExamAttemptDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.examAnswer`: Exposes CRUD operations for the **ExamAnswer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExamAnswers
    * const examAnswers = await prisma.examAnswer.findMany()
    * ```
    */
  get examAnswer(): Prisma.ExamAnswerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatSession`: Exposes CRUD operations for the **ChatSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatSessions
    * const chatSessions = await prisma.chatSession.findMany()
    * ```
    */
  get chatSession(): Prisma.ChatSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatMessage`: Exposes CRUD operations for the **ChatMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatMessages
    * const chatMessages = await prisma.chatMessage.findMany()
    * ```
    */
  get chatMessage(): Prisma.ChatMessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.knowledgeChunk`: Exposes CRUD operations for the **KnowledgeChunk** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KnowledgeChunks
    * const knowledgeChunks = await prisma.knowledgeChunk.findMany()
    * ```
    */
  get knowledgeChunk(): Prisma.KnowledgeChunkDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.7.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Question: 'Question',
    ExamAttempt: 'ExamAttempt',
    ExamAnswer: 'ExamAnswer',
    ChatSession: 'ChatSession',
    ChatMessage: 'ChatMessage',
    KnowledgeChunk: 'KnowledgeChunk'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "question" | "examAttempt" | "examAnswer" | "chatSession" | "chatMessage" | "knowledgeChunk"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Question: {
        payload: Prisma.$QuestionPayload<ExtArgs>
        fields: Prisma.QuestionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuestionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuestionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          findFirst: {
            args: Prisma.QuestionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuestionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          findMany: {
            args: Prisma.QuestionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          create: {
            args: Prisma.QuestionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          createMany: {
            args: Prisma.QuestionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuestionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          delete: {
            args: Prisma.QuestionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          update: {
            args: Prisma.QuestionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          deleteMany: {
            args: Prisma.QuestionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuestionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuestionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          upsert: {
            args: Prisma.QuestionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          aggregate: {
            args: Prisma.QuestionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuestion>
          }
          groupBy: {
            args: Prisma.QuestionGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuestionGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuestionCountArgs<ExtArgs>
            result: $Utils.Optional<QuestionCountAggregateOutputType> | number
          }
        }
      }
      ExamAttempt: {
        payload: Prisma.$ExamAttemptPayload<ExtArgs>
        fields: Prisma.ExamAttemptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExamAttemptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExamAttemptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload>
          }
          findFirst: {
            args: Prisma.ExamAttemptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExamAttemptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload>
          }
          findMany: {
            args: Prisma.ExamAttemptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload>[]
          }
          create: {
            args: Prisma.ExamAttemptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload>
          }
          createMany: {
            args: Prisma.ExamAttemptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExamAttemptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload>[]
          }
          delete: {
            args: Prisma.ExamAttemptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload>
          }
          update: {
            args: Prisma.ExamAttemptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload>
          }
          deleteMany: {
            args: Prisma.ExamAttemptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExamAttemptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExamAttemptUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload>[]
          }
          upsert: {
            args: Prisma.ExamAttemptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload>
          }
          aggregate: {
            args: Prisma.ExamAttemptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExamAttempt>
          }
          groupBy: {
            args: Prisma.ExamAttemptGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExamAttemptGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExamAttemptCountArgs<ExtArgs>
            result: $Utils.Optional<ExamAttemptCountAggregateOutputType> | number
          }
        }
      }
      ExamAnswer: {
        payload: Prisma.$ExamAnswerPayload<ExtArgs>
        fields: Prisma.ExamAnswerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExamAnswerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExamAnswerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload>
          }
          findFirst: {
            args: Prisma.ExamAnswerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExamAnswerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload>
          }
          findMany: {
            args: Prisma.ExamAnswerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload>[]
          }
          create: {
            args: Prisma.ExamAnswerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload>
          }
          createMany: {
            args: Prisma.ExamAnswerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExamAnswerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload>[]
          }
          delete: {
            args: Prisma.ExamAnswerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload>
          }
          update: {
            args: Prisma.ExamAnswerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload>
          }
          deleteMany: {
            args: Prisma.ExamAnswerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExamAnswerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExamAnswerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload>[]
          }
          upsert: {
            args: Prisma.ExamAnswerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload>
          }
          aggregate: {
            args: Prisma.ExamAnswerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExamAnswer>
          }
          groupBy: {
            args: Prisma.ExamAnswerGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExamAnswerGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExamAnswerCountArgs<ExtArgs>
            result: $Utils.Optional<ExamAnswerCountAggregateOutputType> | number
          }
        }
      }
      ChatSession: {
        payload: Prisma.$ChatSessionPayload<ExtArgs>
        fields: Prisma.ChatSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          findFirst: {
            args: Prisma.ChatSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          findMany: {
            args: Prisma.ChatSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>[]
          }
          create: {
            args: Prisma.ChatSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          createMany: {
            args: Prisma.ChatSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>[]
          }
          delete: {
            args: Prisma.ChatSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          update: {
            args: Prisma.ChatSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          deleteMany: {
            args: Prisma.ChatSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>[]
          }
          upsert: {
            args: Prisma.ChatSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          aggregate: {
            args: Prisma.ChatSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatSession>
          }
          groupBy: {
            args: Prisma.ChatSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatSessionCountArgs<ExtArgs>
            result: $Utils.Optional<ChatSessionCountAggregateOutputType> | number
          }
        }
      }
      ChatMessage: {
        payload: Prisma.$ChatMessagePayload<ExtArgs>
        fields: Prisma.ChatMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findFirst: {
            args: Prisma.ChatMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findMany: {
            args: Prisma.ChatMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          create: {
            args: Prisma.ChatMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          createMany: {
            args: Prisma.ChatMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          delete: {
            args: Prisma.ChatMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          update: {
            args: Prisma.ChatMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          deleteMany: {
            args: Prisma.ChatMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          upsert: {
            args: Prisma.ChatMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          aggregate: {
            args: Prisma.ChatMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatMessage>
          }
          groupBy: {
            args: Prisma.ChatMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageCountAggregateOutputType> | number
          }
        }
      }
      KnowledgeChunk: {
        payload: Prisma.$KnowledgeChunkPayload<ExtArgs>
        fields: Prisma.KnowledgeChunkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KnowledgeChunkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KnowledgeChunkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload>
          }
          findFirst: {
            args: Prisma.KnowledgeChunkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KnowledgeChunkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload>
          }
          findMany: {
            args: Prisma.KnowledgeChunkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload>[]
          }
          create: {
            args: Prisma.KnowledgeChunkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload>
          }
          createMany: {
            args: Prisma.KnowledgeChunkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KnowledgeChunkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload>[]
          }
          delete: {
            args: Prisma.KnowledgeChunkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload>
          }
          update: {
            args: Prisma.KnowledgeChunkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload>
          }
          deleteMany: {
            args: Prisma.KnowledgeChunkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KnowledgeChunkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KnowledgeChunkUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload>[]
          }
          upsert: {
            args: Prisma.KnowledgeChunkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload>
          }
          aggregate: {
            args: Prisma.KnowledgeChunkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKnowledgeChunk>
          }
          groupBy: {
            args: Prisma.KnowledgeChunkGroupByArgs<ExtArgs>
            result: $Utils.Optional<KnowledgeChunkGroupByOutputType>[]
          }
          count: {
            args: Prisma.KnowledgeChunkCountArgs<ExtArgs>
            result: $Utils.Optional<KnowledgeChunkCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    question?: QuestionOmit
    examAttempt?: ExamAttemptOmit
    examAnswer?: ExamAnswerOmit
    chatSession?: ChatSessionOmit
    chatMessage?: ChatMessageOmit
    knowledgeChunk?: KnowledgeChunkOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    examAttempts: number
    chatSessions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    examAttempts?: boolean | UserCountOutputTypeCountExamAttemptsArgs
    chatSessions?: boolean | UserCountOutputTypeCountChatSessionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountExamAttemptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamAttemptWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountChatSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatSessionWhereInput
  }


  /**
   * Count Type QuestionCountOutputType
   */

  export type QuestionCountOutputType = {
    examAnswers: number
  }

  export type QuestionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    examAnswers?: boolean | QuestionCountOutputTypeCountExamAnswersArgs
  }

  // Custom InputTypes
  /**
   * QuestionCountOutputType without action
   */
  export type QuestionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionCountOutputType
     */
    select?: QuestionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QuestionCountOutputType without action
   */
  export type QuestionCountOutputTypeCountExamAnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamAnswerWhereInput
  }


  /**
   * Count Type ExamAttemptCountOutputType
   */

  export type ExamAttemptCountOutputType = {
    answers: number
  }

  export type ExamAttemptCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    answers?: boolean | ExamAttemptCountOutputTypeCountAnswersArgs
  }

  // Custom InputTypes
  /**
   * ExamAttemptCountOutputType without action
   */
  export type ExamAttemptCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttemptCountOutputType
     */
    select?: ExamAttemptCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExamAttemptCountOutputType without action
   */
  export type ExamAttemptCountOutputTypeCountAnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamAnswerWhereInput
  }


  /**
   * Count Type ChatSessionCountOutputType
   */

  export type ChatSessionCountOutputType = {
    messages: number
  }

  export type ChatSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ChatSessionCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * ChatSessionCountOutputType without action
   */
  export type ChatSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSessionCountOutputType
     */
    select?: ChatSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChatSessionCountOutputType without action
   */
  export type ChatSessionCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    name: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    name: string
    role: $Enums.UserRole
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    examAttempts?: boolean | User$examAttemptsArgs<ExtArgs>
    chatSessions?: boolean | User$chatSessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "name" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    examAttempts?: boolean | User$examAttemptsArgs<ExtArgs>
    chatSessions?: boolean | User$chatSessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      examAttempts: Prisma.$ExamAttemptPayload<ExtArgs>[]
      chatSessions: Prisma.$ChatSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      name: string
      role: $Enums.UserRole
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    examAttempts<T extends User$examAttemptsArgs<ExtArgs> = {}>(args?: Subset<T, User$examAttemptsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    chatSessions<T extends User$chatSessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$chatSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.examAttempts
   */
  export type User$examAttemptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAttempt
     */
    omit?: ExamAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    where?: ExamAttemptWhereInput
    orderBy?: ExamAttemptOrderByWithRelationInput | ExamAttemptOrderByWithRelationInput[]
    cursor?: ExamAttemptWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExamAttemptScalarFieldEnum | ExamAttemptScalarFieldEnum[]
  }

  /**
   * User.chatSessions
   */
  export type User$chatSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    where?: ChatSessionWhereInput
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    cursor?: ChatSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Question
   */

  export type AggregateQuestion = {
    _count: QuestionCountAggregateOutputType | null
    _min: QuestionMinAggregateOutputType | null
    _max: QuestionMaxAggregateOutputType | null
  }

  export type QuestionMinAggregateOutputType = {
    id: string | null
    content: string | null
    answer: string | null
    explanation: string | null
    topic: $Enums.Topic | null
    difficulty: $Enums.Difficulty | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuestionMaxAggregateOutputType = {
    id: string | null
    content: string | null
    answer: string | null
    explanation: string | null
    topic: $Enums.Topic | null
    difficulty: $Enums.Difficulty | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuestionCountAggregateOutputType = {
    id: number
    content: number
    options: number
    answer: number
    explanation: number
    topic: number
    difficulty: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type QuestionMinAggregateInputType = {
    id?: true
    content?: true
    answer?: true
    explanation?: true
    topic?: true
    difficulty?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuestionMaxAggregateInputType = {
    id?: true
    content?: true
    answer?: true
    explanation?: true
    topic?: true
    difficulty?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuestionCountAggregateInputType = {
    id?: true
    content?: true
    options?: true
    answer?: true
    explanation?: true
    topic?: true
    difficulty?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type QuestionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Question to aggregate.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Questions
    **/
    _count?: true | QuestionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuestionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuestionMaxAggregateInputType
  }

  export type GetQuestionAggregateType<T extends QuestionAggregateArgs> = {
        [P in keyof T & keyof AggregateQuestion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuestion[P]>
      : GetScalarType<T[P], AggregateQuestion[P]>
  }




  export type QuestionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionWhereInput
    orderBy?: QuestionOrderByWithAggregationInput | QuestionOrderByWithAggregationInput[]
    by: QuestionScalarFieldEnum[] | QuestionScalarFieldEnum
    having?: QuestionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuestionCountAggregateInputType | true
    _min?: QuestionMinAggregateInputType
    _max?: QuestionMaxAggregateInputType
  }

  export type QuestionGroupByOutputType = {
    id: string
    content: string
    options: JsonValue
    answer: string
    explanation: string
    topic: $Enums.Topic
    difficulty: $Enums.Difficulty
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: QuestionCountAggregateOutputType | null
    _min: QuestionMinAggregateOutputType | null
    _max: QuestionMaxAggregateOutputType | null
  }

  type GetQuestionGroupByPayload<T extends QuestionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuestionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuestionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuestionGroupByOutputType[P]>
            : GetScalarType<T[P], QuestionGroupByOutputType[P]>
        }
      >
    >


  export type QuestionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    options?: boolean
    answer?: boolean
    explanation?: boolean
    topic?: boolean
    difficulty?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    examAnswers?: boolean | Question$examAnswersArgs<ExtArgs>
    _count?: boolean | QuestionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    options?: boolean
    answer?: boolean
    explanation?: boolean
    topic?: boolean
    difficulty?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    options?: boolean
    answer?: boolean
    explanation?: boolean
    topic?: boolean
    difficulty?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectScalar = {
    id?: boolean
    content?: boolean
    options?: boolean
    answer?: boolean
    explanation?: boolean
    topic?: boolean
    difficulty?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type QuestionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "options" | "answer" | "explanation" | "topic" | "difficulty" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["question"]>
  export type QuestionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    examAnswers?: boolean | Question$examAnswersArgs<ExtArgs>
    _count?: boolean | QuestionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type QuestionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type QuestionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $QuestionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Question"
    objects: {
      examAnswers: Prisma.$ExamAnswerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      options: Prisma.JsonValue
      answer: string
      explanation: string
      topic: $Enums.Topic
      difficulty: $Enums.Difficulty
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["question"]>
    composites: {}
  }

  type QuestionGetPayload<S extends boolean | null | undefined | QuestionDefaultArgs> = $Result.GetResult<Prisma.$QuestionPayload, S>

  type QuestionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuestionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuestionCountAggregateInputType | true
    }

  export interface QuestionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Question'], meta: { name: 'Question' } }
    /**
     * Find zero or one Question that matches the filter.
     * @param {QuestionFindUniqueArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuestionFindUniqueArgs>(args: SelectSubset<T, QuestionFindUniqueArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Question that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuestionFindUniqueOrThrowArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuestionFindUniqueOrThrowArgs>(args: SelectSubset<T, QuestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Question that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindFirstArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuestionFindFirstArgs>(args?: SelectSubset<T, QuestionFindFirstArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Question that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindFirstOrThrowArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuestionFindFirstOrThrowArgs>(args?: SelectSubset<T, QuestionFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Questions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Questions
     * const questions = await prisma.question.findMany()
     * 
     * // Get first 10 Questions
     * const questions = await prisma.question.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const questionWithIdOnly = await prisma.question.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuestionFindManyArgs>(args?: SelectSubset<T, QuestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Question.
     * @param {QuestionCreateArgs} args - Arguments to create a Question.
     * @example
     * // Create one Question
     * const Question = await prisma.question.create({
     *   data: {
     *     // ... data to create a Question
     *   }
     * })
     * 
     */
    create<T extends QuestionCreateArgs>(args: SelectSubset<T, QuestionCreateArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Questions.
     * @param {QuestionCreateManyArgs} args - Arguments to create many Questions.
     * @example
     * // Create many Questions
     * const question = await prisma.question.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuestionCreateManyArgs>(args?: SelectSubset<T, QuestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Questions and returns the data saved in the database.
     * @param {QuestionCreateManyAndReturnArgs} args - Arguments to create many Questions.
     * @example
     * // Create many Questions
     * const question = await prisma.question.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Questions and only return the `id`
     * const questionWithIdOnly = await prisma.question.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuestionCreateManyAndReturnArgs>(args?: SelectSubset<T, QuestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Question.
     * @param {QuestionDeleteArgs} args - Arguments to delete one Question.
     * @example
     * // Delete one Question
     * const Question = await prisma.question.delete({
     *   where: {
     *     // ... filter to delete one Question
     *   }
     * })
     * 
     */
    delete<T extends QuestionDeleteArgs>(args: SelectSubset<T, QuestionDeleteArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Question.
     * @param {QuestionUpdateArgs} args - Arguments to update one Question.
     * @example
     * // Update one Question
     * const question = await prisma.question.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuestionUpdateArgs>(args: SelectSubset<T, QuestionUpdateArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Questions.
     * @param {QuestionDeleteManyArgs} args - Arguments to filter Questions to delete.
     * @example
     * // Delete a few Questions
     * const { count } = await prisma.question.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuestionDeleteManyArgs>(args?: SelectSubset<T, QuestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Questions
     * const question = await prisma.question.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuestionUpdateManyArgs>(args: SelectSubset<T, QuestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions and returns the data updated in the database.
     * @param {QuestionUpdateManyAndReturnArgs} args - Arguments to update many Questions.
     * @example
     * // Update many Questions
     * const question = await prisma.question.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Questions and only return the `id`
     * const questionWithIdOnly = await prisma.question.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends QuestionUpdateManyAndReturnArgs>(args: SelectSubset<T, QuestionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Question.
     * @param {QuestionUpsertArgs} args - Arguments to update or create a Question.
     * @example
     * // Update or create a Question
     * const question = await prisma.question.upsert({
     *   create: {
     *     // ... data to create a Question
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Question we want to update
     *   }
     * })
     */
    upsert<T extends QuestionUpsertArgs>(args: SelectSubset<T, QuestionUpsertArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionCountArgs} args - Arguments to filter Questions to count.
     * @example
     * // Count the number of Questions
     * const count = await prisma.question.count({
     *   where: {
     *     // ... the filter for the Questions we want to count
     *   }
     * })
    **/
    count<T extends QuestionCountArgs>(
      args?: Subset<T, QuestionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuestionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Question.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuestionAggregateArgs>(args: Subset<T, QuestionAggregateArgs>): Prisma.PrismaPromise<GetQuestionAggregateType<T>>

    /**
     * Group by Question.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuestionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuestionGroupByArgs['orderBy'] }
        : { orderBy?: QuestionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Question model
   */
  readonly fields: QuestionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Question.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuestionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    examAnswers<T extends Question$examAnswersArgs<ExtArgs> = {}>(args?: Subset<T, Question$examAnswersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Question model
   */
  interface QuestionFieldRefs {
    readonly id: FieldRef<"Question", 'String'>
    readonly content: FieldRef<"Question", 'String'>
    readonly options: FieldRef<"Question", 'Json'>
    readonly answer: FieldRef<"Question", 'String'>
    readonly explanation: FieldRef<"Question", 'String'>
    readonly topic: FieldRef<"Question", 'Topic'>
    readonly difficulty: FieldRef<"Question", 'Difficulty'>
    readonly isActive: FieldRef<"Question", 'Boolean'>
    readonly createdAt: FieldRef<"Question", 'DateTime'>
    readonly updatedAt: FieldRef<"Question", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Question findUnique
   */
  export type QuestionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question findUniqueOrThrow
   */
  export type QuestionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question findFirst
   */
  export type QuestionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questions.
     */
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question findFirstOrThrow
   */
  export type QuestionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questions.
     */
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question findMany
   */
  export type QuestionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Questions to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questions.
     */
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question create
   */
  export type QuestionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The data needed to create a Question.
     */
    data: XOR<QuestionCreateInput, QuestionUncheckedCreateInput>
  }

  /**
   * Question createMany
   */
  export type QuestionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Questions.
     */
    data: QuestionCreateManyInput | QuestionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Question createManyAndReturn
   */
  export type QuestionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * The data used to create many Questions.
     */
    data: QuestionCreateManyInput | QuestionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Question update
   */
  export type QuestionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The data needed to update a Question.
     */
    data: XOR<QuestionUpdateInput, QuestionUncheckedUpdateInput>
    /**
     * Choose, which Question to update.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question updateMany
   */
  export type QuestionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Questions.
     */
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyInput>
    /**
     * Filter which Questions to update
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to update.
     */
    limit?: number
  }

  /**
   * Question updateManyAndReturn
   */
  export type QuestionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * The data used to update Questions.
     */
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyInput>
    /**
     * Filter which Questions to update
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to update.
     */
    limit?: number
  }

  /**
   * Question upsert
   */
  export type QuestionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The filter to search for the Question to update in case it exists.
     */
    where: QuestionWhereUniqueInput
    /**
     * In case the Question found by the `where` argument doesn't exist, create a new Question with this data.
     */
    create: XOR<QuestionCreateInput, QuestionUncheckedCreateInput>
    /**
     * In case the Question was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuestionUpdateInput, QuestionUncheckedUpdateInput>
  }

  /**
   * Question delete
   */
  export type QuestionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter which Question to delete.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question deleteMany
   */
  export type QuestionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Questions to delete
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to delete.
     */
    limit?: number
  }

  /**
   * Question.examAnswers
   */
  export type Question$examAnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAnswer
     */
    omit?: ExamAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    where?: ExamAnswerWhereInput
    orderBy?: ExamAnswerOrderByWithRelationInput | ExamAnswerOrderByWithRelationInput[]
    cursor?: ExamAnswerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExamAnswerScalarFieldEnum | ExamAnswerScalarFieldEnum[]
  }

  /**
   * Question without action
   */
  export type QuestionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
  }


  /**
   * Model ExamAttempt
   */

  export type AggregateExamAttempt = {
    _count: ExamAttemptCountAggregateOutputType | null
    _avg: ExamAttemptAvgAggregateOutputType | null
    _sum: ExamAttemptSumAggregateOutputType | null
    _min: ExamAttemptMinAggregateOutputType | null
    _max: ExamAttemptMaxAggregateOutputType | null
  }

  export type ExamAttemptAvgAggregateOutputType = {
    totalScore: number | null
    totalQuestions: number | null
    timeTakenSecs: number | null
  }

  export type ExamAttemptSumAggregateOutputType = {
    totalScore: number | null
    totalQuestions: number | null
    timeTakenSecs: number | null
  }

  export type ExamAttemptMinAggregateOutputType = {
    id: string | null
    userId: string | null
    totalScore: number | null
    totalQuestions: number | null
    timeTakenSecs: number | null
    startedAt: Date | null
    submittedAt: Date | null
  }

  export type ExamAttemptMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    totalScore: number | null
    totalQuestions: number | null
    timeTakenSecs: number | null
    startedAt: Date | null
    submittedAt: Date | null
  }

  export type ExamAttemptCountAggregateOutputType = {
    id: number
    userId: number
    totalScore: number
    totalQuestions: number
    timeTakenSecs: number
    topics: number
    startedAt: number
    submittedAt: number
    _all: number
  }


  export type ExamAttemptAvgAggregateInputType = {
    totalScore?: true
    totalQuestions?: true
    timeTakenSecs?: true
  }

  export type ExamAttemptSumAggregateInputType = {
    totalScore?: true
    totalQuestions?: true
    timeTakenSecs?: true
  }

  export type ExamAttemptMinAggregateInputType = {
    id?: true
    userId?: true
    totalScore?: true
    totalQuestions?: true
    timeTakenSecs?: true
    startedAt?: true
    submittedAt?: true
  }

  export type ExamAttemptMaxAggregateInputType = {
    id?: true
    userId?: true
    totalScore?: true
    totalQuestions?: true
    timeTakenSecs?: true
    startedAt?: true
    submittedAt?: true
  }

  export type ExamAttemptCountAggregateInputType = {
    id?: true
    userId?: true
    totalScore?: true
    totalQuestions?: true
    timeTakenSecs?: true
    topics?: true
    startedAt?: true
    submittedAt?: true
    _all?: true
  }

  export type ExamAttemptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExamAttempt to aggregate.
     */
    where?: ExamAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamAttempts to fetch.
     */
    orderBy?: ExamAttemptOrderByWithRelationInput | ExamAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExamAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExamAttempts
    **/
    _count?: true | ExamAttemptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExamAttemptAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExamAttemptSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExamAttemptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExamAttemptMaxAggregateInputType
  }

  export type GetExamAttemptAggregateType<T extends ExamAttemptAggregateArgs> = {
        [P in keyof T & keyof AggregateExamAttempt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExamAttempt[P]>
      : GetScalarType<T[P], AggregateExamAttempt[P]>
  }




  export type ExamAttemptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamAttemptWhereInput
    orderBy?: ExamAttemptOrderByWithAggregationInput | ExamAttemptOrderByWithAggregationInput[]
    by: ExamAttemptScalarFieldEnum[] | ExamAttemptScalarFieldEnum
    having?: ExamAttemptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExamAttemptCountAggregateInputType | true
    _avg?: ExamAttemptAvgAggregateInputType
    _sum?: ExamAttemptSumAggregateInputType
    _min?: ExamAttemptMinAggregateInputType
    _max?: ExamAttemptMaxAggregateInputType
  }

  export type ExamAttemptGroupByOutputType = {
    id: string
    userId: string
    totalScore: number
    totalQuestions: number
    timeTakenSecs: number
    topics: $Enums.Topic[]
    startedAt: Date
    submittedAt: Date
    _count: ExamAttemptCountAggregateOutputType | null
    _avg: ExamAttemptAvgAggregateOutputType | null
    _sum: ExamAttemptSumAggregateOutputType | null
    _min: ExamAttemptMinAggregateOutputType | null
    _max: ExamAttemptMaxAggregateOutputType | null
  }

  type GetExamAttemptGroupByPayload<T extends ExamAttemptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExamAttemptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExamAttemptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExamAttemptGroupByOutputType[P]>
            : GetScalarType<T[P], ExamAttemptGroupByOutputType[P]>
        }
      >
    >


  export type ExamAttemptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    totalScore?: boolean
    totalQuestions?: boolean
    timeTakenSecs?: boolean
    topics?: boolean
    startedAt?: boolean
    submittedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    answers?: boolean | ExamAttempt$answersArgs<ExtArgs>
    _count?: boolean | ExamAttemptCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examAttempt"]>

  export type ExamAttemptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    totalScore?: boolean
    totalQuestions?: boolean
    timeTakenSecs?: boolean
    topics?: boolean
    startedAt?: boolean
    submittedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examAttempt"]>

  export type ExamAttemptSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    totalScore?: boolean
    totalQuestions?: boolean
    timeTakenSecs?: boolean
    topics?: boolean
    startedAt?: boolean
    submittedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examAttempt"]>

  export type ExamAttemptSelectScalar = {
    id?: boolean
    userId?: boolean
    totalScore?: boolean
    totalQuestions?: boolean
    timeTakenSecs?: boolean
    topics?: boolean
    startedAt?: boolean
    submittedAt?: boolean
  }

  export type ExamAttemptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "totalScore" | "totalQuestions" | "timeTakenSecs" | "topics" | "startedAt" | "submittedAt", ExtArgs["result"]["examAttempt"]>
  export type ExamAttemptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    answers?: boolean | ExamAttempt$answersArgs<ExtArgs>
    _count?: boolean | ExamAttemptCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExamAttemptIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ExamAttemptIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ExamAttemptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExamAttempt"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      answers: Prisma.$ExamAnswerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      totalScore: number
      totalQuestions: number
      timeTakenSecs: number
      topics: $Enums.Topic[]
      startedAt: Date
      submittedAt: Date
    }, ExtArgs["result"]["examAttempt"]>
    composites: {}
  }

  type ExamAttemptGetPayload<S extends boolean | null | undefined | ExamAttemptDefaultArgs> = $Result.GetResult<Prisma.$ExamAttemptPayload, S>

  type ExamAttemptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExamAttemptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExamAttemptCountAggregateInputType | true
    }

  export interface ExamAttemptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExamAttempt'], meta: { name: 'ExamAttempt' } }
    /**
     * Find zero or one ExamAttempt that matches the filter.
     * @param {ExamAttemptFindUniqueArgs} args - Arguments to find a ExamAttempt
     * @example
     * // Get one ExamAttempt
     * const examAttempt = await prisma.examAttempt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExamAttemptFindUniqueArgs>(args: SelectSubset<T, ExamAttemptFindUniqueArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExamAttempt that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExamAttemptFindUniqueOrThrowArgs} args - Arguments to find a ExamAttempt
     * @example
     * // Get one ExamAttempt
     * const examAttempt = await prisma.examAttempt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExamAttemptFindUniqueOrThrowArgs>(args: SelectSubset<T, ExamAttemptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExamAttempt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAttemptFindFirstArgs} args - Arguments to find a ExamAttempt
     * @example
     * // Get one ExamAttempt
     * const examAttempt = await prisma.examAttempt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExamAttemptFindFirstArgs>(args?: SelectSubset<T, ExamAttemptFindFirstArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExamAttempt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAttemptFindFirstOrThrowArgs} args - Arguments to find a ExamAttempt
     * @example
     * // Get one ExamAttempt
     * const examAttempt = await prisma.examAttempt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExamAttemptFindFirstOrThrowArgs>(args?: SelectSubset<T, ExamAttemptFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExamAttempts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAttemptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExamAttempts
     * const examAttempts = await prisma.examAttempt.findMany()
     * 
     * // Get first 10 ExamAttempts
     * const examAttempts = await prisma.examAttempt.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const examAttemptWithIdOnly = await prisma.examAttempt.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExamAttemptFindManyArgs>(args?: SelectSubset<T, ExamAttemptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExamAttempt.
     * @param {ExamAttemptCreateArgs} args - Arguments to create a ExamAttempt.
     * @example
     * // Create one ExamAttempt
     * const ExamAttempt = await prisma.examAttempt.create({
     *   data: {
     *     // ... data to create a ExamAttempt
     *   }
     * })
     * 
     */
    create<T extends ExamAttemptCreateArgs>(args: SelectSubset<T, ExamAttemptCreateArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExamAttempts.
     * @param {ExamAttemptCreateManyArgs} args - Arguments to create many ExamAttempts.
     * @example
     * // Create many ExamAttempts
     * const examAttempt = await prisma.examAttempt.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExamAttemptCreateManyArgs>(args?: SelectSubset<T, ExamAttemptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExamAttempts and returns the data saved in the database.
     * @param {ExamAttemptCreateManyAndReturnArgs} args - Arguments to create many ExamAttempts.
     * @example
     * // Create many ExamAttempts
     * const examAttempt = await prisma.examAttempt.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExamAttempts and only return the `id`
     * const examAttemptWithIdOnly = await prisma.examAttempt.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExamAttemptCreateManyAndReturnArgs>(args?: SelectSubset<T, ExamAttemptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExamAttempt.
     * @param {ExamAttemptDeleteArgs} args - Arguments to delete one ExamAttempt.
     * @example
     * // Delete one ExamAttempt
     * const ExamAttempt = await prisma.examAttempt.delete({
     *   where: {
     *     // ... filter to delete one ExamAttempt
     *   }
     * })
     * 
     */
    delete<T extends ExamAttemptDeleteArgs>(args: SelectSubset<T, ExamAttemptDeleteArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExamAttempt.
     * @param {ExamAttemptUpdateArgs} args - Arguments to update one ExamAttempt.
     * @example
     * // Update one ExamAttempt
     * const examAttempt = await prisma.examAttempt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExamAttemptUpdateArgs>(args: SelectSubset<T, ExamAttemptUpdateArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExamAttempts.
     * @param {ExamAttemptDeleteManyArgs} args - Arguments to filter ExamAttempts to delete.
     * @example
     * // Delete a few ExamAttempts
     * const { count } = await prisma.examAttempt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExamAttemptDeleteManyArgs>(args?: SelectSubset<T, ExamAttemptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExamAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAttemptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExamAttempts
     * const examAttempt = await prisma.examAttempt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExamAttemptUpdateManyArgs>(args: SelectSubset<T, ExamAttemptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExamAttempts and returns the data updated in the database.
     * @param {ExamAttemptUpdateManyAndReturnArgs} args - Arguments to update many ExamAttempts.
     * @example
     * // Update many ExamAttempts
     * const examAttempt = await prisma.examAttempt.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExamAttempts and only return the `id`
     * const examAttemptWithIdOnly = await prisma.examAttempt.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExamAttemptUpdateManyAndReturnArgs>(args: SelectSubset<T, ExamAttemptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExamAttempt.
     * @param {ExamAttemptUpsertArgs} args - Arguments to update or create a ExamAttempt.
     * @example
     * // Update or create a ExamAttempt
     * const examAttempt = await prisma.examAttempt.upsert({
     *   create: {
     *     // ... data to create a ExamAttempt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExamAttempt we want to update
     *   }
     * })
     */
    upsert<T extends ExamAttemptUpsertArgs>(args: SelectSubset<T, ExamAttemptUpsertArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExamAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAttemptCountArgs} args - Arguments to filter ExamAttempts to count.
     * @example
     * // Count the number of ExamAttempts
     * const count = await prisma.examAttempt.count({
     *   where: {
     *     // ... the filter for the ExamAttempts we want to count
     *   }
     * })
    **/
    count<T extends ExamAttemptCountArgs>(
      args?: Subset<T, ExamAttemptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExamAttemptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExamAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAttemptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExamAttemptAggregateArgs>(args: Subset<T, ExamAttemptAggregateArgs>): Prisma.PrismaPromise<GetExamAttemptAggregateType<T>>

    /**
     * Group by ExamAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAttemptGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExamAttemptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExamAttemptGroupByArgs['orderBy'] }
        : { orderBy?: ExamAttemptGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExamAttemptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExamAttemptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExamAttempt model
   */
  readonly fields: ExamAttemptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExamAttempt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExamAttemptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    answers<T extends ExamAttempt$answersArgs<ExtArgs> = {}>(args?: Subset<T, ExamAttempt$answersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExamAttempt model
   */
  interface ExamAttemptFieldRefs {
    readonly id: FieldRef<"ExamAttempt", 'String'>
    readonly userId: FieldRef<"ExamAttempt", 'String'>
    readonly totalScore: FieldRef<"ExamAttempt", 'Int'>
    readonly totalQuestions: FieldRef<"ExamAttempt", 'Int'>
    readonly timeTakenSecs: FieldRef<"ExamAttempt", 'Int'>
    readonly topics: FieldRef<"ExamAttempt", 'Topic[]'>
    readonly startedAt: FieldRef<"ExamAttempt", 'DateTime'>
    readonly submittedAt: FieldRef<"ExamAttempt", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExamAttempt findUnique
   */
  export type ExamAttemptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAttempt
     */
    omit?: ExamAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * Filter, which ExamAttempt to fetch.
     */
    where: ExamAttemptWhereUniqueInput
  }

  /**
   * ExamAttempt findUniqueOrThrow
   */
  export type ExamAttemptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAttempt
     */
    omit?: ExamAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * Filter, which ExamAttempt to fetch.
     */
    where: ExamAttemptWhereUniqueInput
  }

  /**
   * ExamAttempt findFirst
   */
  export type ExamAttemptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAttempt
     */
    omit?: ExamAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * Filter, which ExamAttempt to fetch.
     */
    where?: ExamAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamAttempts to fetch.
     */
    orderBy?: ExamAttemptOrderByWithRelationInput | ExamAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExamAttempts.
     */
    cursor?: ExamAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamAttempts.
     */
    distinct?: ExamAttemptScalarFieldEnum | ExamAttemptScalarFieldEnum[]
  }

  /**
   * ExamAttempt findFirstOrThrow
   */
  export type ExamAttemptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAttempt
     */
    omit?: ExamAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * Filter, which ExamAttempt to fetch.
     */
    where?: ExamAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamAttempts to fetch.
     */
    orderBy?: ExamAttemptOrderByWithRelationInput | ExamAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExamAttempts.
     */
    cursor?: ExamAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamAttempts.
     */
    distinct?: ExamAttemptScalarFieldEnum | ExamAttemptScalarFieldEnum[]
  }

  /**
   * ExamAttempt findMany
   */
  export type ExamAttemptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAttempt
     */
    omit?: ExamAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * Filter, which ExamAttempts to fetch.
     */
    where?: ExamAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamAttempts to fetch.
     */
    orderBy?: ExamAttemptOrderByWithRelationInput | ExamAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExamAttempts.
     */
    cursor?: ExamAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamAttempts.
     */
    distinct?: ExamAttemptScalarFieldEnum | ExamAttemptScalarFieldEnum[]
  }

  /**
   * ExamAttempt create
   */
  export type ExamAttemptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAttempt
     */
    omit?: ExamAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * The data needed to create a ExamAttempt.
     */
    data: XOR<ExamAttemptCreateInput, ExamAttemptUncheckedCreateInput>
  }

  /**
   * ExamAttempt createMany
   */
  export type ExamAttemptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExamAttempts.
     */
    data: ExamAttemptCreateManyInput | ExamAttemptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExamAttempt createManyAndReturn
   */
  export type ExamAttemptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAttempt
     */
    omit?: ExamAttemptOmit<ExtArgs> | null
    /**
     * The data used to create many ExamAttempts.
     */
    data: ExamAttemptCreateManyInput | ExamAttemptCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExamAttempt update
   */
  export type ExamAttemptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAttempt
     */
    omit?: ExamAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * The data needed to update a ExamAttempt.
     */
    data: XOR<ExamAttemptUpdateInput, ExamAttemptUncheckedUpdateInput>
    /**
     * Choose, which ExamAttempt to update.
     */
    where: ExamAttemptWhereUniqueInput
  }

  /**
   * ExamAttempt updateMany
   */
  export type ExamAttemptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExamAttempts.
     */
    data: XOR<ExamAttemptUpdateManyMutationInput, ExamAttemptUncheckedUpdateManyInput>
    /**
     * Filter which ExamAttempts to update
     */
    where?: ExamAttemptWhereInput
    /**
     * Limit how many ExamAttempts to update.
     */
    limit?: number
  }

  /**
   * ExamAttempt updateManyAndReturn
   */
  export type ExamAttemptUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAttempt
     */
    omit?: ExamAttemptOmit<ExtArgs> | null
    /**
     * The data used to update ExamAttempts.
     */
    data: XOR<ExamAttemptUpdateManyMutationInput, ExamAttemptUncheckedUpdateManyInput>
    /**
     * Filter which ExamAttempts to update
     */
    where?: ExamAttemptWhereInput
    /**
     * Limit how many ExamAttempts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExamAttempt upsert
   */
  export type ExamAttemptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAttempt
     */
    omit?: ExamAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * The filter to search for the ExamAttempt to update in case it exists.
     */
    where: ExamAttemptWhereUniqueInput
    /**
     * In case the ExamAttempt found by the `where` argument doesn't exist, create a new ExamAttempt with this data.
     */
    create: XOR<ExamAttemptCreateInput, ExamAttemptUncheckedCreateInput>
    /**
     * In case the ExamAttempt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExamAttemptUpdateInput, ExamAttemptUncheckedUpdateInput>
  }

  /**
   * ExamAttempt delete
   */
  export type ExamAttemptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAttempt
     */
    omit?: ExamAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * Filter which ExamAttempt to delete.
     */
    where: ExamAttemptWhereUniqueInput
  }

  /**
   * ExamAttempt deleteMany
   */
  export type ExamAttemptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExamAttempts to delete
     */
    where?: ExamAttemptWhereInput
    /**
     * Limit how many ExamAttempts to delete.
     */
    limit?: number
  }

  /**
   * ExamAttempt.answers
   */
  export type ExamAttempt$answersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAnswer
     */
    omit?: ExamAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    where?: ExamAnswerWhereInput
    orderBy?: ExamAnswerOrderByWithRelationInput | ExamAnswerOrderByWithRelationInput[]
    cursor?: ExamAnswerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExamAnswerScalarFieldEnum | ExamAnswerScalarFieldEnum[]
  }

  /**
   * ExamAttempt without action
   */
  export type ExamAttemptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAttempt
     */
    omit?: ExamAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
  }


  /**
   * Model ExamAnswer
   */

  export type AggregateExamAnswer = {
    _count: ExamAnswerCountAggregateOutputType | null
    _min: ExamAnswerMinAggregateOutputType | null
    _max: ExamAnswerMaxAggregateOutputType | null
  }

  export type ExamAnswerMinAggregateOutputType = {
    id: string | null
    examAttemptId: string | null
    questionId: string | null
    userAnswer: string | null
    isCorrect: boolean | null
  }

  export type ExamAnswerMaxAggregateOutputType = {
    id: string | null
    examAttemptId: string | null
    questionId: string | null
    userAnswer: string | null
    isCorrect: boolean | null
  }

  export type ExamAnswerCountAggregateOutputType = {
    id: number
    examAttemptId: number
    questionId: number
    userAnswer: number
    isCorrect: number
    _all: number
  }


  export type ExamAnswerMinAggregateInputType = {
    id?: true
    examAttemptId?: true
    questionId?: true
    userAnswer?: true
    isCorrect?: true
  }

  export type ExamAnswerMaxAggregateInputType = {
    id?: true
    examAttemptId?: true
    questionId?: true
    userAnswer?: true
    isCorrect?: true
  }

  export type ExamAnswerCountAggregateInputType = {
    id?: true
    examAttemptId?: true
    questionId?: true
    userAnswer?: true
    isCorrect?: true
    _all?: true
  }

  export type ExamAnswerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExamAnswer to aggregate.
     */
    where?: ExamAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamAnswers to fetch.
     */
    orderBy?: ExamAnswerOrderByWithRelationInput | ExamAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExamAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExamAnswers
    **/
    _count?: true | ExamAnswerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExamAnswerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExamAnswerMaxAggregateInputType
  }

  export type GetExamAnswerAggregateType<T extends ExamAnswerAggregateArgs> = {
        [P in keyof T & keyof AggregateExamAnswer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExamAnswer[P]>
      : GetScalarType<T[P], AggregateExamAnswer[P]>
  }




  export type ExamAnswerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamAnswerWhereInput
    orderBy?: ExamAnswerOrderByWithAggregationInput | ExamAnswerOrderByWithAggregationInput[]
    by: ExamAnswerScalarFieldEnum[] | ExamAnswerScalarFieldEnum
    having?: ExamAnswerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExamAnswerCountAggregateInputType | true
    _min?: ExamAnswerMinAggregateInputType
    _max?: ExamAnswerMaxAggregateInputType
  }

  export type ExamAnswerGroupByOutputType = {
    id: string
    examAttemptId: string
    questionId: string
    userAnswer: string | null
    isCorrect: boolean
    _count: ExamAnswerCountAggregateOutputType | null
    _min: ExamAnswerMinAggregateOutputType | null
    _max: ExamAnswerMaxAggregateOutputType | null
  }

  type GetExamAnswerGroupByPayload<T extends ExamAnswerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExamAnswerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExamAnswerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExamAnswerGroupByOutputType[P]>
            : GetScalarType<T[P], ExamAnswerGroupByOutputType[P]>
        }
      >
    >


  export type ExamAnswerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    examAttemptId?: boolean
    questionId?: boolean
    userAnswer?: boolean
    isCorrect?: boolean
    examAttempt?: boolean | ExamAttemptDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examAnswer"]>

  export type ExamAnswerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    examAttemptId?: boolean
    questionId?: boolean
    userAnswer?: boolean
    isCorrect?: boolean
    examAttempt?: boolean | ExamAttemptDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examAnswer"]>

  export type ExamAnswerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    examAttemptId?: boolean
    questionId?: boolean
    userAnswer?: boolean
    isCorrect?: boolean
    examAttempt?: boolean | ExamAttemptDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examAnswer"]>

  export type ExamAnswerSelectScalar = {
    id?: boolean
    examAttemptId?: boolean
    questionId?: boolean
    userAnswer?: boolean
    isCorrect?: boolean
  }

  export type ExamAnswerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "examAttemptId" | "questionId" | "userAnswer" | "isCorrect", ExtArgs["result"]["examAnswer"]>
  export type ExamAnswerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    examAttempt?: boolean | ExamAttemptDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }
  export type ExamAnswerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    examAttempt?: boolean | ExamAttemptDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }
  export type ExamAnswerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    examAttempt?: boolean | ExamAttemptDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }

  export type $ExamAnswerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExamAnswer"
    objects: {
      examAttempt: Prisma.$ExamAttemptPayload<ExtArgs>
      question: Prisma.$QuestionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      examAttemptId: string
      questionId: string
      userAnswer: string | null
      isCorrect: boolean
    }, ExtArgs["result"]["examAnswer"]>
    composites: {}
  }

  type ExamAnswerGetPayload<S extends boolean | null | undefined | ExamAnswerDefaultArgs> = $Result.GetResult<Prisma.$ExamAnswerPayload, S>

  type ExamAnswerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExamAnswerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExamAnswerCountAggregateInputType | true
    }

  export interface ExamAnswerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExamAnswer'], meta: { name: 'ExamAnswer' } }
    /**
     * Find zero or one ExamAnswer that matches the filter.
     * @param {ExamAnswerFindUniqueArgs} args - Arguments to find a ExamAnswer
     * @example
     * // Get one ExamAnswer
     * const examAnswer = await prisma.examAnswer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExamAnswerFindUniqueArgs>(args: SelectSubset<T, ExamAnswerFindUniqueArgs<ExtArgs>>): Prisma__ExamAnswerClient<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExamAnswer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExamAnswerFindUniqueOrThrowArgs} args - Arguments to find a ExamAnswer
     * @example
     * // Get one ExamAnswer
     * const examAnswer = await prisma.examAnswer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExamAnswerFindUniqueOrThrowArgs>(args: SelectSubset<T, ExamAnswerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExamAnswerClient<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExamAnswer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAnswerFindFirstArgs} args - Arguments to find a ExamAnswer
     * @example
     * // Get one ExamAnswer
     * const examAnswer = await prisma.examAnswer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExamAnswerFindFirstArgs>(args?: SelectSubset<T, ExamAnswerFindFirstArgs<ExtArgs>>): Prisma__ExamAnswerClient<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExamAnswer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAnswerFindFirstOrThrowArgs} args - Arguments to find a ExamAnswer
     * @example
     * // Get one ExamAnswer
     * const examAnswer = await prisma.examAnswer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExamAnswerFindFirstOrThrowArgs>(args?: SelectSubset<T, ExamAnswerFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExamAnswerClient<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExamAnswers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAnswerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExamAnswers
     * const examAnswers = await prisma.examAnswer.findMany()
     * 
     * // Get first 10 ExamAnswers
     * const examAnswers = await prisma.examAnswer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const examAnswerWithIdOnly = await prisma.examAnswer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExamAnswerFindManyArgs>(args?: SelectSubset<T, ExamAnswerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExamAnswer.
     * @param {ExamAnswerCreateArgs} args - Arguments to create a ExamAnswer.
     * @example
     * // Create one ExamAnswer
     * const ExamAnswer = await prisma.examAnswer.create({
     *   data: {
     *     // ... data to create a ExamAnswer
     *   }
     * })
     * 
     */
    create<T extends ExamAnswerCreateArgs>(args: SelectSubset<T, ExamAnswerCreateArgs<ExtArgs>>): Prisma__ExamAnswerClient<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExamAnswers.
     * @param {ExamAnswerCreateManyArgs} args - Arguments to create many ExamAnswers.
     * @example
     * // Create many ExamAnswers
     * const examAnswer = await prisma.examAnswer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExamAnswerCreateManyArgs>(args?: SelectSubset<T, ExamAnswerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExamAnswers and returns the data saved in the database.
     * @param {ExamAnswerCreateManyAndReturnArgs} args - Arguments to create many ExamAnswers.
     * @example
     * // Create many ExamAnswers
     * const examAnswer = await prisma.examAnswer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExamAnswers and only return the `id`
     * const examAnswerWithIdOnly = await prisma.examAnswer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExamAnswerCreateManyAndReturnArgs>(args?: SelectSubset<T, ExamAnswerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExamAnswer.
     * @param {ExamAnswerDeleteArgs} args - Arguments to delete one ExamAnswer.
     * @example
     * // Delete one ExamAnswer
     * const ExamAnswer = await prisma.examAnswer.delete({
     *   where: {
     *     // ... filter to delete one ExamAnswer
     *   }
     * })
     * 
     */
    delete<T extends ExamAnswerDeleteArgs>(args: SelectSubset<T, ExamAnswerDeleteArgs<ExtArgs>>): Prisma__ExamAnswerClient<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExamAnswer.
     * @param {ExamAnswerUpdateArgs} args - Arguments to update one ExamAnswer.
     * @example
     * // Update one ExamAnswer
     * const examAnswer = await prisma.examAnswer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExamAnswerUpdateArgs>(args: SelectSubset<T, ExamAnswerUpdateArgs<ExtArgs>>): Prisma__ExamAnswerClient<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExamAnswers.
     * @param {ExamAnswerDeleteManyArgs} args - Arguments to filter ExamAnswers to delete.
     * @example
     * // Delete a few ExamAnswers
     * const { count } = await prisma.examAnswer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExamAnswerDeleteManyArgs>(args?: SelectSubset<T, ExamAnswerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExamAnswers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAnswerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExamAnswers
     * const examAnswer = await prisma.examAnswer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExamAnswerUpdateManyArgs>(args: SelectSubset<T, ExamAnswerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExamAnswers and returns the data updated in the database.
     * @param {ExamAnswerUpdateManyAndReturnArgs} args - Arguments to update many ExamAnswers.
     * @example
     * // Update many ExamAnswers
     * const examAnswer = await prisma.examAnswer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExamAnswers and only return the `id`
     * const examAnswerWithIdOnly = await prisma.examAnswer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExamAnswerUpdateManyAndReturnArgs>(args: SelectSubset<T, ExamAnswerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExamAnswer.
     * @param {ExamAnswerUpsertArgs} args - Arguments to update or create a ExamAnswer.
     * @example
     * // Update or create a ExamAnswer
     * const examAnswer = await prisma.examAnswer.upsert({
     *   create: {
     *     // ... data to create a ExamAnswer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExamAnswer we want to update
     *   }
     * })
     */
    upsert<T extends ExamAnswerUpsertArgs>(args: SelectSubset<T, ExamAnswerUpsertArgs<ExtArgs>>): Prisma__ExamAnswerClient<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExamAnswers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAnswerCountArgs} args - Arguments to filter ExamAnswers to count.
     * @example
     * // Count the number of ExamAnswers
     * const count = await prisma.examAnswer.count({
     *   where: {
     *     // ... the filter for the ExamAnswers we want to count
     *   }
     * })
    **/
    count<T extends ExamAnswerCountArgs>(
      args?: Subset<T, ExamAnswerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExamAnswerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExamAnswer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAnswerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExamAnswerAggregateArgs>(args: Subset<T, ExamAnswerAggregateArgs>): Prisma.PrismaPromise<GetExamAnswerAggregateType<T>>

    /**
     * Group by ExamAnswer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAnswerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExamAnswerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExamAnswerGroupByArgs['orderBy'] }
        : { orderBy?: ExamAnswerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExamAnswerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExamAnswerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExamAnswer model
   */
  readonly fields: ExamAnswerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExamAnswer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExamAnswerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    examAttempt<T extends ExamAttemptDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExamAttemptDefaultArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    question<T extends QuestionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuestionDefaultArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExamAnswer model
   */
  interface ExamAnswerFieldRefs {
    readonly id: FieldRef<"ExamAnswer", 'String'>
    readonly examAttemptId: FieldRef<"ExamAnswer", 'String'>
    readonly questionId: FieldRef<"ExamAnswer", 'String'>
    readonly userAnswer: FieldRef<"ExamAnswer", 'String'>
    readonly isCorrect: FieldRef<"ExamAnswer", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * ExamAnswer findUnique
   */
  export type ExamAnswerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAnswer
     */
    omit?: ExamAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * Filter, which ExamAnswer to fetch.
     */
    where: ExamAnswerWhereUniqueInput
  }

  /**
   * ExamAnswer findUniqueOrThrow
   */
  export type ExamAnswerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAnswer
     */
    omit?: ExamAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * Filter, which ExamAnswer to fetch.
     */
    where: ExamAnswerWhereUniqueInput
  }

  /**
   * ExamAnswer findFirst
   */
  export type ExamAnswerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAnswer
     */
    omit?: ExamAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * Filter, which ExamAnswer to fetch.
     */
    where?: ExamAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamAnswers to fetch.
     */
    orderBy?: ExamAnswerOrderByWithRelationInput | ExamAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExamAnswers.
     */
    cursor?: ExamAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamAnswers.
     */
    distinct?: ExamAnswerScalarFieldEnum | ExamAnswerScalarFieldEnum[]
  }

  /**
   * ExamAnswer findFirstOrThrow
   */
  export type ExamAnswerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAnswer
     */
    omit?: ExamAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * Filter, which ExamAnswer to fetch.
     */
    where?: ExamAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamAnswers to fetch.
     */
    orderBy?: ExamAnswerOrderByWithRelationInput | ExamAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExamAnswers.
     */
    cursor?: ExamAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamAnswers.
     */
    distinct?: ExamAnswerScalarFieldEnum | ExamAnswerScalarFieldEnum[]
  }

  /**
   * ExamAnswer findMany
   */
  export type ExamAnswerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAnswer
     */
    omit?: ExamAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * Filter, which ExamAnswers to fetch.
     */
    where?: ExamAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamAnswers to fetch.
     */
    orderBy?: ExamAnswerOrderByWithRelationInput | ExamAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExamAnswers.
     */
    cursor?: ExamAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamAnswers.
     */
    distinct?: ExamAnswerScalarFieldEnum | ExamAnswerScalarFieldEnum[]
  }

  /**
   * ExamAnswer create
   */
  export type ExamAnswerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAnswer
     */
    omit?: ExamAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * The data needed to create a ExamAnswer.
     */
    data: XOR<ExamAnswerCreateInput, ExamAnswerUncheckedCreateInput>
  }

  /**
   * ExamAnswer createMany
   */
  export type ExamAnswerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExamAnswers.
     */
    data: ExamAnswerCreateManyInput | ExamAnswerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExamAnswer createManyAndReturn
   */
  export type ExamAnswerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAnswer
     */
    omit?: ExamAnswerOmit<ExtArgs> | null
    /**
     * The data used to create many ExamAnswers.
     */
    data: ExamAnswerCreateManyInput | ExamAnswerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExamAnswer update
   */
  export type ExamAnswerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAnswer
     */
    omit?: ExamAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * The data needed to update a ExamAnswer.
     */
    data: XOR<ExamAnswerUpdateInput, ExamAnswerUncheckedUpdateInput>
    /**
     * Choose, which ExamAnswer to update.
     */
    where: ExamAnswerWhereUniqueInput
  }

  /**
   * ExamAnswer updateMany
   */
  export type ExamAnswerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExamAnswers.
     */
    data: XOR<ExamAnswerUpdateManyMutationInput, ExamAnswerUncheckedUpdateManyInput>
    /**
     * Filter which ExamAnswers to update
     */
    where?: ExamAnswerWhereInput
    /**
     * Limit how many ExamAnswers to update.
     */
    limit?: number
  }

  /**
   * ExamAnswer updateManyAndReturn
   */
  export type ExamAnswerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAnswer
     */
    omit?: ExamAnswerOmit<ExtArgs> | null
    /**
     * The data used to update ExamAnswers.
     */
    data: XOR<ExamAnswerUpdateManyMutationInput, ExamAnswerUncheckedUpdateManyInput>
    /**
     * Filter which ExamAnswers to update
     */
    where?: ExamAnswerWhereInput
    /**
     * Limit how many ExamAnswers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExamAnswer upsert
   */
  export type ExamAnswerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAnswer
     */
    omit?: ExamAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * The filter to search for the ExamAnswer to update in case it exists.
     */
    where: ExamAnswerWhereUniqueInput
    /**
     * In case the ExamAnswer found by the `where` argument doesn't exist, create a new ExamAnswer with this data.
     */
    create: XOR<ExamAnswerCreateInput, ExamAnswerUncheckedCreateInput>
    /**
     * In case the ExamAnswer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExamAnswerUpdateInput, ExamAnswerUncheckedUpdateInput>
  }

  /**
   * ExamAnswer delete
   */
  export type ExamAnswerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAnswer
     */
    omit?: ExamAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * Filter which ExamAnswer to delete.
     */
    where: ExamAnswerWhereUniqueInput
  }

  /**
   * ExamAnswer deleteMany
   */
  export type ExamAnswerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExamAnswers to delete
     */
    where?: ExamAnswerWhereInput
    /**
     * Limit how many ExamAnswers to delete.
     */
    limit?: number
  }

  /**
   * ExamAnswer without action
   */
  export type ExamAnswerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamAnswer
     */
    omit?: ExamAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
  }


  /**
   * Model ChatSession
   */

  export type AggregateChatSession = {
    _count: ChatSessionCountAggregateOutputType | null
    _min: ChatSessionMinAggregateOutputType | null
    _max: ChatSessionMaxAggregateOutputType | null
  }

  export type ChatSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChatSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChatSessionCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ChatSessionMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChatSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChatSessionCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ChatSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatSession to aggregate.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatSessions
    **/
    _count?: true | ChatSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatSessionMaxAggregateInputType
  }

  export type GetChatSessionAggregateType<T extends ChatSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateChatSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatSession[P]>
      : GetScalarType<T[P], AggregateChatSession[P]>
  }




  export type ChatSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatSessionWhereInput
    orderBy?: ChatSessionOrderByWithAggregationInput | ChatSessionOrderByWithAggregationInput[]
    by: ChatSessionScalarFieldEnum[] | ChatSessionScalarFieldEnum
    having?: ChatSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatSessionCountAggregateInputType | true
    _min?: ChatSessionMinAggregateInputType
    _max?: ChatSessionMaxAggregateInputType
  }

  export type ChatSessionGroupByOutputType = {
    id: string
    userId: string
    title: string
    createdAt: Date
    updatedAt: Date
    _count: ChatSessionCountAggregateOutputType | null
    _min: ChatSessionMinAggregateOutputType | null
    _max: ChatSessionMaxAggregateOutputType | null
  }

  type GetChatSessionGroupByPayload<T extends ChatSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatSessionGroupByOutputType[P]>
            : GetScalarType<T[P], ChatSessionGroupByOutputType[P]>
        }
      >
    >


  export type ChatSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    messages?: boolean | ChatSession$messagesArgs<ExtArgs>
    _count?: boolean | ChatSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatSession"]>

  export type ChatSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatSession"]>

  export type ChatSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatSession"]>

  export type ChatSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ChatSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "createdAt" | "updatedAt", ExtArgs["result"]["chatSession"]>
  export type ChatSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    messages?: boolean | ChatSession$messagesArgs<ExtArgs>
    _count?: boolean | ChatSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChatSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ChatSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ChatSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      messages: Prisma.$ChatMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["chatSession"]>
    composites: {}
  }

  type ChatSessionGetPayload<S extends boolean | null | undefined | ChatSessionDefaultArgs> = $Result.GetResult<Prisma.$ChatSessionPayload, S>

  type ChatSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatSessionCountAggregateInputType | true
    }

  export interface ChatSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatSession'], meta: { name: 'ChatSession' } }
    /**
     * Find zero or one ChatSession that matches the filter.
     * @param {ChatSessionFindUniqueArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatSessionFindUniqueArgs>(args: SelectSubset<T, ChatSessionFindUniqueArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatSessionFindUniqueOrThrowArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindFirstArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatSessionFindFirstArgs>(args?: SelectSubset<T, ChatSessionFindFirstArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindFirstOrThrowArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatSessions
     * const chatSessions = await prisma.chatSession.findMany()
     * 
     * // Get first 10 ChatSessions
     * const chatSessions = await prisma.chatSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatSessionWithIdOnly = await prisma.chatSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatSessionFindManyArgs>(args?: SelectSubset<T, ChatSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatSession.
     * @param {ChatSessionCreateArgs} args - Arguments to create a ChatSession.
     * @example
     * // Create one ChatSession
     * const ChatSession = await prisma.chatSession.create({
     *   data: {
     *     // ... data to create a ChatSession
     *   }
     * })
     * 
     */
    create<T extends ChatSessionCreateArgs>(args: SelectSubset<T, ChatSessionCreateArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatSessions.
     * @param {ChatSessionCreateManyArgs} args - Arguments to create many ChatSessions.
     * @example
     * // Create many ChatSessions
     * const chatSession = await prisma.chatSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatSessionCreateManyArgs>(args?: SelectSubset<T, ChatSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatSessions and returns the data saved in the database.
     * @param {ChatSessionCreateManyAndReturnArgs} args - Arguments to create many ChatSessions.
     * @example
     * // Create many ChatSessions
     * const chatSession = await prisma.chatSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatSessions and only return the `id`
     * const chatSessionWithIdOnly = await prisma.chatSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatSession.
     * @param {ChatSessionDeleteArgs} args - Arguments to delete one ChatSession.
     * @example
     * // Delete one ChatSession
     * const ChatSession = await prisma.chatSession.delete({
     *   where: {
     *     // ... filter to delete one ChatSession
     *   }
     * })
     * 
     */
    delete<T extends ChatSessionDeleteArgs>(args: SelectSubset<T, ChatSessionDeleteArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatSession.
     * @param {ChatSessionUpdateArgs} args - Arguments to update one ChatSession.
     * @example
     * // Update one ChatSession
     * const chatSession = await prisma.chatSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatSessionUpdateArgs>(args: SelectSubset<T, ChatSessionUpdateArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatSessions.
     * @param {ChatSessionDeleteManyArgs} args - Arguments to filter ChatSessions to delete.
     * @example
     * // Delete a few ChatSessions
     * const { count } = await prisma.chatSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatSessionDeleteManyArgs>(args?: SelectSubset<T, ChatSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatSessions
     * const chatSession = await prisma.chatSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatSessionUpdateManyArgs>(args: SelectSubset<T, ChatSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatSessions and returns the data updated in the database.
     * @param {ChatSessionUpdateManyAndReturnArgs} args - Arguments to update many ChatSessions.
     * @example
     * // Update many ChatSessions
     * const chatSession = await prisma.chatSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatSessions and only return the `id`
     * const chatSessionWithIdOnly = await prisma.chatSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatSession.
     * @param {ChatSessionUpsertArgs} args - Arguments to update or create a ChatSession.
     * @example
     * // Update or create a ChatSession
     * const chatSession = await prisma.chatSession.upsert({
     *   create: {
     *     // ... data to create a ChatSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatSession we want to update
     *   }
     * })
     */
    upsert<T extends ChatSessionUpsertArgs>(args: SelectSubset<T, ChatSessionUpsertArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionCountArgs} args - Arguments to filter ChatSessions to count.
     * @example
     * // Count the number of ChatSessions
     * const count = await prisma.chatSession.count({
     *   where: {
     *     // ... the filter for the ChatSessions we want to count
     *   }
     * })
    **/
    count<T extends ChatSessionCountArgs>(
      args?: Subset<T, ChatSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatSessionAggregateArgs>(args: Subset<T, ChatSessionAggregateArgs>): Prisma.PrismaPromise<GetChatSessionAggregateType<T>>

    /**
     * Group by ChatSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatSessionGroupByArgs['orderBy'] }
        : { orderBy?: ChatSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatSession model
   */
  readonly fields: ChatSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    messages<T extends ChatSession$messagesArgs<ExtArgs> = {}>(args?: Subset<T, ChatSession$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatSession model
   */
  interface ChatSessionFieldRefs {
    readonly id: FieldRef<"ChatSession", 'String'>
    readonly userId: FieldRef<"ChatSession", 'String'>
    readonly title: FieldRef<"ChatSession", 'String'>
    readonly createdAt: FieldRef<"ChatSession", 'DateTime'>
    readonly updatedAt: FieldRef<"ChatSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatSession findUnique
   */
  export type ChatSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession findUniqueOrThrow
   */
  export type ChatSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession findFirst
   */
  export type ChatSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatSessions.
     */
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession findFirstOrThrow
   */
  export type ChatSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatSessions.
     */
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession findMany
   */
  export type ChatSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSessions to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatSessions.
     */
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession create
   */
  export type ChatSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatSession.
     */
    data: XOR<ChatSessionCreateInput, ChatSessionUncheckedCreateInput>
  }

  /**
   * ChatSession createMany
   */
  export type ChatSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatSessions.
     */
    data: ChatSessionCreateManyInput | ChatSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatSession createManyAndReturn
   */
  export type ChatSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * The data used to create many ChatSessions.
     */
    data: ChatSessionCreateManyInput | ChatSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatSession update
   */
  export type ChatSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatSession.
     */
    data: XOR<ChatSessionUpdateInput, ChatSessionUncheckedUpdateInput>
    /**
     * Choose, which ChatSession to update.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession updateMany
   */
  export type ChatSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatSessions.
     */
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyInput>
    /**
     * Filter which ChatSessions to update
     */
    where?: ChatSessionWhereInput
    /**
     * Limit how many ChatSessions to update.
     */
    limit?: number
  }

  /**
   * ChatSession updateManyAndReturn
   */
  export type ChatSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * The data used to update ChatSessions.
     */
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyInput>
    /**
     * Filter which ChatSessions to update
     */
    where?: ChatSessionWhereInput
    /**
     * Limit how many ChatSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatSession upsert
   */
  export type ChatSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatSession to update in case it exists.
     */
    where: ChatSessionWhereUniqueInput
    /**
     * In case the ChatSession found by the `where` argument doesn't exist, create a new ChatSession with this data.
     */
    create: XOR<ChatSessionCreateInput, ChatSessionUncheckedCreateInput>
    /**
     * In case the ChatSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatSessionUpdateInput, ChatSessionUncheckedUpdateInput>
  }

  /**
   * ChatSession delete
   */
  export type ChatSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter which ChatSession to delete.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession deleteMany
   */
  export type ChatSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatSessions to delete
     */
    where?: ChatSessionWhereInput
    /**
     * Limit how many ChatSessions to delete.
     */
    limit?: number
  }

  /**
   * ChatSession.messages
   */
  export type ChatSession$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    cursor?: ChatMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatSession without action
   */
  export type ChatSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
  }


  /**
   * Model ChatMessage
   */

  export type AggregateChatMessage = {
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  export type ChatMessageMinAggregateOutputType = {
    id: string | null
    chatSessionId: string | null
    role: $Enums.MessageRole | null
    content: string | null
    createdAt: Date | null
  }

  export type ChatMessageMaxAggregateOutputType = {
    id: string | null
    chatSessionId: string | null
    role: $Enums.MessageRole | null
    content: string | null
    createdAt: Date | null
  }

  export type ChatMessageCountAggregateOutputType = {
    id: number
    chatSessionId: number
    role: number
    content: number
    createdAt: number
    _all: number
  }


  export type ChatMessageMinAggregateInputType = {
    id?: true
    chatSessionId?: true
    role?: true
    content?: true
    createdAt?: true
  }

  export type ChatMessageMaxAggregateInputType = {
    id?: true
    chatSessionId?: true
    role?: true
    content?: true
    createdAt?: true
  }

  export type ChatMessageCountAggregateInputType = {
    id?: true
    chatSessionId?: true
    role?: true
    content?: true
    createdAt?: true
    _all?: true
  }

  export type ChatMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessage to aggregate.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatMessages
    **/
    _count?: true | ChatMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatMessageMaxAggregateInputType
  }

  export type GetChatMessageAggregateType<T extends ChatMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateChatMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatMessage[P]>
      : GetScalarType<T[P], AggregateChatMessage[P]>
  }




  export type ChatMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithAggregationInput | ChatMessageOrderByWithAggregationInput[]
    by: ChatMessageScalarFieldEnum[] | ChatMessageScalarFieldEnum
    having?: ChatMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatMessageCountAggregateInputType | true
    _min?: ChatMessageMinAggregateInputType
    _max?: ChatMessageMaxAggregateInputType
  }

  export type ChatMessageGroupByOutputType = {
    id: string
    chatSessionId: string
    role: $Enums.MessageRole
    content: string
    createdAt: Date
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  type GetChatMessageGroupByPayload<T extends ChatMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
        }
      >
    >


  export type ChatMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chatSessionId?: boolean
    role?: boolean
    content?: boolean
    createdAt?: boolean
    chatSession?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chatSessionId?: boolean
    role?: boolean
    content?: boolean
    createdAt?: boolean
    chatSession?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chatSessionId?: boolean
    role?: boolean
    content?: boolean
    createdAt?: boolean
    chatSession?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectScalar = {
    id?: boolean
    chatSessionId?: boolean
    role?: boolean
    content?: boolean
    createdAt?: boolean
  }

  export type ChatMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "chatSessionId" | "role" | "content" | "createdAt", ExtArgs["result"]["chatMessage"]>
  export type ChatMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chatSession?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }
  export type ChatMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chatSession?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }
  export type ChatMessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chatSession?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }

  export type $ChatMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatMessage"
    objects: {
      chatSession: Prisma.$ChatSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      chatSessionId: string
      role: $Enums.MessageRole
      content: string
      createdAt: Date
    }, ExtArgs["result"]["chatMessage"]>
    composites: {}
  }

  type ChatMessageGetPayload<S extends boolean | null | undefined | ChatMessageDefaultArgs> = $Result.GetResult<Prisma.$ChatMessagePayload, S>

  type ChatMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatMessageCountAggregateInputType | true
    }

  export interface ChatMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatMessage'], meta: { name: 'ChatMessage' } }
    /**
     * Find zero or one ChatMessage that matches the filter.
     * @param {ChatMessageFindUniqueArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatMessageFindUniqueArgs>(args: SelectSubset<T, ChatMessageFindUniqueArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatMessageFindUniqueOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatMessageFindFirstArgs>(args?: SelectSubset<T, ChatMessageFindFirstArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany()
     * 
     * // Get first 10 ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatMessageFindManyArgs>(args?: SelectSubset<T, ChatMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatMessage.
     * @param {ChatMessageCreateArgs} args - Arguments to create a ChatMessage.
     * @example
     * // Create one ChatMessage
     * const ChatMessage = await prisma.chatMessage.create({
     *   data: {
     *     // ... data to create a ChatMessage
     *   }
     * })
     * 
     */
    create<T extends ChatMessageCreateArgs>(args: SelectSubset<T, ChatMessageCreateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatMessages.
     * @param {ChatMessageCreateManyArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatMessageCreateManyArgs>(args?: SelectSubset<T, ChatMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatMessages and returns the data saved in the database.
     * @param {ChatMessageCreateManyAndReturnArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatMessages and only return the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatMessage.
     * @param {ChatMessageDeleteArgs} args - Arguments to delete one ChatMessage.
     * @example
     * // Delete one ChatMessage
     * const ChatMessage = await prisma.chatMessage.delete({
     *   where: {
     *     // ... filter to delete one ChatMessage
     *   }
     * })
     * 
     */
    delete<T extends ChatMessageDeleteArgs>(args: SelectSubset<T, ChatMessageDeleteArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatMessage.
     * @param {ChatMessageUpdateArgs} args - Arguments to update one ChatMessage.
     * @example
     * // Update one ChatMessage
     * const chatMessage = await prisma.chatMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatMessageUpdateArgs>(args: SelectSubset<T, ChatMessageUpdateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatMessages.
     * @param {ChatMessageDeleteManyArgs} args - Arguments to filter ChatMessages to delete.
     * @example
     * // Delete a few ChatMessages
     * const { count } = await prisma.chatMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatMessageDeleteManyArgs>(args?: SelectSubset<T, ChatMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatMessageUpdateManyArgs>(args: SelectSubset<T, ChatMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages and returns the data updated in the database.
     * @param {ChatMessageUpdateManyAndReturnArgs} args - Arguments to update many ChatMessages.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatMessages and only return the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatMessage.
     * @param {ChatMessageUpsertArgs} args - Arguments to update or create a ChatMessage.
     * @example
     * // Update or create a ChatMessage
     * const chatMessage = await prisma.chatMessage.upsert({
     *   create: {
     *     // ... data to create a ChatMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatMessage we want to update
     *   }
     * })
     */
    upsert<T extends ChatMessageUpsertArgs>(args: SelectSubset<T, ChatMessageUpsertArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageCountArgs} args - Arguments to filter ChatMessages to count.
     * @example
     * // Count the number of ChatMessages
     * const count = await prisma.chatMessage.count({
     *   where: {
     *     // ... the filter for the ChatMessages we want to count
     *   }
     * })
    **/
    count<T extends ChatMessageCountArgs>(
      args?: Subset<T, ChatMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatMessageAggregateArgs>(args: Subset<T, ChatMessageAggregateArgs>): Prisma.PrismaPromise<GetChatMessageAggregateType<T>>

    /**
     * Group by ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatMessageGroupByArgs['orderBy'] }
        : { orderBy?: ChatMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatMessage model
   */
  readonly fields: ChatMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    chatSession<T extends ChatSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChatSessionDefaultArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatMessage model
   */
  interface ChatMessageFieldRefs {
    readonly id: FieldRef<"ChatMessage", 'String'>
    readonly chatSessionId: FieldRef<"ChatMessage", 'String'>
    readonly role: FieldRef<"ChatMessage", 'MessageRole'>
    readonly content: FieldRef<"ChatMessage", 'String'>
    readonly createdAt: FieldRef<"ChatMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatMessage findUnique
   */
  export type ChatMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findUniqueOrThrow
   */
  export type ChatMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findFirst
   */
  export type ChatMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findFirstOrThrow
   */
  export type ChatMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findMany
   */
  export type ChatMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessages to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage create
   */
  export type ChatMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatMessage.
     */
    data: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
  }

  /**
   * ChatMessage createMany
   */
  export type ChatMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatMessage createManyAndReturn
   */
  export type ChatMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatMessage update
   */
  export type ChatMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatMessage.
     */
    data: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
    /**
     * Choose, which ChatMessage to update.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage updateMany
   */
  export type ChatMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number
  }

  /**
   * ChatMessage updateManyAndReturn
   */
  export type ChatMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatMessage upsert
   */
  export type ChatMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatMessage to update in case it exists.
     */
    where: ChatMessageWhereUniqueInput
    /**
     * In case the ChatMessage found by the `where` argument doesn't exist, create a new ChatMessage with this data.
     */
    create: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
    /**
     * In case the ChatMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
  }

  /**
   * ChatMessage delete
   */
  export type ChatMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter which ChatMessage to delete.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage deleteMany
   */
  export type ChatMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessages to delete
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to delete.
     */
    limit?: number
  }

  /**
   * ChatMessage without action
   */
  export type ChatMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
  }


  /**
   * Model KnowledgeChunk
   */

  export type AggregateKnowledgeChunk = {
    _count: KnowledgeChunkCountAggregateOutputType | null
    _min: KnowledgeChunkMinAggregateOutputType | null
    _max: KnowledgeChunkMaxAggregateOutputType | null
  }

  export type KnowledgeChunkMinAggregateOutputType = {
    id: string | null
    content: string | null
    topic: $Enums.Topic | null
    source: string | null
    createdAt: Date | null
  }

  export type KnowledgeChunkMaxAggregateOutputType = {
    id: string | null
    content: string | null
    topic: $Enums.Topic | null
    source: string | null
    createdAt: Date | null
  }

  export type KnowledgeChunkCountAggregateOutputType = {
    id: number
    content: number
    topic: number
    source: number
    createdAt: number
    _all: number
  }


  export type KnowledgeChunkMinAggregateInputType = {
    id?: true
    content?: true
    topic?: true
    source?: true
    createdAt?: true
  }

  export type KnowledgeChunkMaxAggregateInputType = {
    id?: true
    content?: true
    topic?: true
    source?: true
    createdAt?: true
  }

  export type KnowledgeChunkCountAggregateInputType = {
    id?: true
    content?: true
    topic?: true
    source?: true
    createdAt?: true
    _all?: true
  }

  export type KnowledgeChunkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KnowledgeChunk to aggregate.
     */
    where?: KnowledgeChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeChunks to fetch.
     */
    orderBy?: KnowledgeChunkOrderByWithRelationInput | KnowledgeChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KnowledgeChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KnowledgeChunks
    **/
    _count?: true | KnowledgeChunkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KnowledgeChunkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KnowledgeChunkMaxAggregateInputType
  }

  export type GetKnowledgeChunkAggregateType<T extends KnowledgeChunkAggregateArgs> = {
        [P in keyof T & keyof AggregateKnowledgeChunk]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKnowledgeChunk[P]>
      : GetScalarType<T[P], AggregateKnowledgeChunk[P]>
  }




  export type KnowledgeChunkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KnowledgeChunkWhereInput
    orderBy?: KnowledgeChunkOrderByWithAggregationInput | KnowledgeChunkOrderByWithAggregationInput[]
    by: KnowledgeChunkScalarFieldEnum[] | KnowledgeChunkScalarFieldEnum
    having?: KnowledgeChunkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KnowledgeChunkCountAggregateInputType | true
    _min?: KnowledgeChunkMinAggregateInputType
    _max?: KnowledgeChunkMaxAggregateInputType
  }

  export type KnowledgeChunkGroupByOutputType = {
    id: string
    content: string
    topic: $Enums.Topic
    source: string
    createdAt: Date
    _count: KnowledgeChunkCountAggregateOutputType | null
    _min: KnowledgeChunkMinAggregateOutputType | null
    _max: KnowledgeChunkMaxAggregateOutputType | null
  }

  type GetKnowledgeChunkGroupByPayload<T extends KnowledgeChunkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KnowledgeChunkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KnowledgeChunkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KnowledgeChunkGroupByOutputType[P]>
            : GetScalarType<T[P], KnowledgeChunkGroupByOutputType[P]>
        }
      >
    >


  export type KnowledgeChunkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    topic?: boolean
    source?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["knowledgeChunk"]>

  export type KnowledgeChunkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    topic?: boolean
    source?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["knowledgeChunk"]>

  export type KnowledgeChunkSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    topic?: boolean
    source?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["knowledgeChunk"]>

  export type KnowledgeChunkSelectScalar = {
    id?: boolean
    content?: boolean
    topic?: boolean
    source?: boolean
    createdAt?: boolean
  }

  export type KnowledgeChunkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "topic" | "source" | "createdAt", ExtArgs["result"]["knowledgeChunk"]>

  export type $KnowledgeChunkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KnowledgeChunk"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      topic: $Enums.Topic
      source: string
      createdAt: Date
    }, ExtArgs["result"]["knowledgeChunk"]>
    composites: {}
  }

  type KnowledgeChunkGetPayload<S extends boolean | null | undefined | KnowledgeChunkDefaultArgs> = $Result.GetResult<Prisma.$KnowledgeChunkPayload, S>

  type KnowledgeChunkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KnowledgeChunkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KnowledgeChunkCountAggregateInputType | true
    }

  export interface KnowledgeChunkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KnowledgeChunk'], meta: { name: 'KnowledgeChunk' } }
    /**
     * Find zero or one KnowledgeChunk that matches the filter.
     * @param {KnowledgeChunkFindUniqueArgs} args - Arguments to find a KnowledgeChunk
     * @example
     * // Get one KnowledgeChunk
     * const knowledgeChunk = await prisma.knowledgeChunk.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KnowledgeChunkFindUniqueArgs>(args: SelectSubset<T, KnowledgeChunkFindUniqueArgs<ExtArgs>>): Prisma__KnowledgeChunkClient<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KnowledgeChunk that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KnowledgeChunkFindUniqueOrThrowArgs} args - Arguments to find a KnowledgeChunk
     * @example
     * // Get one KnowledgeChunk
     * const knowledgeChunk = await prisma.knowledgeChunk.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KnowledgeChunkFindUniqueOrThrowArgs>(args: SelectSubset<T, KnowledgeChunkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KnowledgeChunkClient<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KnowledgeChunk that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChunkFindFirstArgs} args - Arguments to find a KnowledgeChunk
     * @example
     * // Get one KnowledgeChunk
     * const knowledgeChunk = await prisma.knowledgeChunk.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KnowledgeChunkFindFirstArgs>(args?: SelectSubset<T, KnowledgeChunkFindFirstArgs<ExtArgs>>): Prisma__KnowledgeChunkClient<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KnowledgeChunk that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChunkFindFirstOrThrowArgs} args - Arguments to find a KnowledgeChunk
     * @example
     * // Get one KnowledgeChunk
     * const knowledgeChunk = await prisma.knowledgeChunk.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KnowledgeChunkFindFirstOrThrowArgs>(args?: SelectSubset<T, KnowledgeChunkFindFirstOrThrowArgs<ExtArgs>>): Prisma__KnowledgeChunkClient<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KnowledgeChunks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChunkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KnowledgeChunks
     * const knowledgeChunks = await prisma.knowledgeChunk.findMany()
     * 
     * // Get first 10 KnowledgeChunks
     * const knowledgeChunks = await prisma.knowledgeChunk.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const knowledgeChunkWithIdOnly = await prisma.knowledgeChunk.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KnowledgeChunkFindManyArgs>(args?: SelectSubset<T, KnowledgeChunkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KnowledgeChunk.
     * @param {KnowledgeChunkCreateArgs} args - Arguments to create a KnowledgeChunk.
     * @example
     * // Create one KnowledgeChunk
     * const KnowledgeChunk = await prisma.knowledgeChunk.create({
     *   data: {
     *     // ... data to create a KnowledgeChunk
     *   }
     * })
     * 
     */
    create<T extends KnowledgeChunkCreateArgs>(args: SelectSubset<T, KnowledgeChunkCreateArgs<ExtArgs>>): Prisma__KnowledgeChunkClient<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KnowledgeChunks.
     * @param {KnowledgeChunkCreateManyArgs} args - Arguments to create many KnowledgeChunks.
     * @example
     * // Create many KnowledgeChunks
     * const knowledgeChunk = await prisma.knowledgeChunk.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KnowledgeChunkCreateManyArgs>(args?: SelectSubset<T, KnowledgeChunkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KnowledgeChunks and returns the data saved in the database.
     * @param {KnowledgeChunkCreateManyAndReturnArgs} args - Arguments to create many KnowledgeChunks.
     * @example
     * // Create many KnowledgeChunks
     * const knowledgeChunk = await prisma.knowledgeChunk.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KnowledgeChunks and only return the `id`
     * const knowledgeChunkWithIdOnly = await prisma.knowledgeChunk.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KnowledgeChunkCreateManyAndReturnArgs>(args?: SelectSubset<T, KnowledgeChunkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KnowledgeChunk.
     * @param {KnowledgeChunkDeleteArgs} args - Arguments to delete one KnowledgeChunk.
     * @example
     * // Delete one KnowledgeChunk
     * const KnowledgeChunk = await prisma.knowledgeChunk.delete({
     *   where: {
     *     // ... filter to delete one KnowledgeChunk
     *   }
     * })
     * 
     */
    delete<T extends KnowledgeChunkDeleteArgs>(args: SelectSubset<T, KnowledgeChunkDeleteArgs<ExtArgs>>): Prisma__KnowledgeChunkClient<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KnowledgeChunk.
     * @param {KnowledgeChunkUpdateArgs} args - Arguments to update one KnowledgeChunk.
     * @example
     * // Update one KnowledgeChunk
     * const knowledgeChunk = await prisma.knowledgeChunk.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KnowledgeChunkUpdateArgs>(args: SelectSubset<T, KnowledgeChunkUpdateArgs<ExtArgs>>): Prisma__KnowledgeChunkClient<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KnowledgeChunks.
     * @param {KnowledgeChunkDeleteManyArgs} args - Arguments to filter KnowledgeChunks to delete.
     * @example
     * // Delete a few KnowledgeChunks
     * const { count } = await prisma.knowledgeChunk.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KnowledgeChunkDeleteManyArgs>(args?: SelectSubset<T, KnowledgeChunkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KnowledgeChunks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChunkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KnowledgeChunks
     * const knowledgeChunk = await prisma.knowledgeChunk.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KnowledgeChunkUpdateManyArgs>(args: SelectSubset<T, KnowledgeChunkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KnowledgeChunks and returns the data updated in the database.
     * @param {KnowledgeChunkUpdateManyAndReturnArgs} args - Arguments to update many KnowledgeChunks.
     * @example
     * // Update many KnowledgeChunks
     * const knowledgeChunk = await prisma.knowledgeChunk.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KnowledgeChunks and only return the `id`
     * const knowledgeChunkWithIdOnly = await prisma.knowledgeChunk.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KnowledgeChunkUpdateManyAndReturnArgs>(args: SelectSubset<T, KnowledgeChunkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KnowledgeChunk.
     * @param {KnowledgeChunkUpsertArgs} args - Arguments to update or create a KnowledgeChunk.
     * @example
     * // Update or create a KnowledgeChunk
     * const knowledgeChunk = await prisma.knowledgeChunk.upsert({
     *   create: {
     *     // ... data to create a KnowledgeChunk
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KnowledgeChunk we want to update
     *   }
     * })
     */
    upsert<T extends KnowledgeChunkUpsertArgs>(args: SelectSubset<T, KnowledgeChunkUpsertArgs<ExtArgs>>): Prisma__KnowledgeChunkClient<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KnowledgeChunks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChunkCountArgs} args - Arguments to filter KnowledgeChunks to count.
     * @example
     * // Count the number of KnowledgeChunks
     * const count = await prisma.knowledgeChunk.count({
     *   where: {
     *     // ... the filter for the KnowledgeChunks we want to count
     *   }
     * })
    **/
    count<T extends KnowledgeChunkCountArgs>(
      args?: Subset<T, KnowledgeChunkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KnowledgeChunkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KnowledgeChunk.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChunkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KnowledgeChunkAggregateArgs>(args: Subset<T, KnowledgeChunkAggregateArgs>): Prisma.PrismaPromise<GetKnowledgeChunkAggregateType<T>>

    /**
     * Group by KnowledgeChunk.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChunkGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KnowledgeChunkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KnowledgeChunkGroupByArgs['orderBy'] }
        : { orderBy?: KnowledgeChunkGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KnowledgeChunkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKnowledgeChunkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KnowledgeChunk model
   */
  readonly fields: KnowledgeChunkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KnowledgeChunk.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KnowledgeChunkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KnowledgeChunk model
   */
  interface KnowledgeChunkFieldRefs {
    readonly id: FieldRef<"KnowledgeChunk", 'String'>
    readonly content: FieldRef<"KnowledgeChunk", 'String'>
    readonly topic: FieldRef<"KnowledgeChunk", 'Topic'>
    readonly source: FieldRef<"KnowledgeChunk", 'String'>
    readonly createdAt: FieldRef<"KnowledgeChunk", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KnowledgeChunk findUnique
   */
  export type KnowledgeChunkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * Filter, which KnowledgeChunk to fetch.
     */
    where: KnowledgeChunkWhereUniqueInput
  }

  /**
   * KnowledgeChunk findUniqueOrThrow
   */
  export type KnowledgeChunkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * Filter, which KnowledgeChunk to fetch.
     */
    where: KnowledgeChunkWhereUniqueInput
  }

  /**
   * KnowledgeChunk findFirst
   */
  export type KnowledgeChunkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * Filter, which KnowledgeChunk to fetch.
     */
    where?: KnowledgeChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeChunks to fetch.
     */
    orderBy?: KnowledgeChunkOrderByWithRelationInput | KnowledgeChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KnowledgeChunks.
     */
    cursor?: KnowledgeChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KnowledgeChunks.
     */
    distinct?: KnowledgeChunkScalarFieldEnum | KnowledgeChunkScalarFieldEnum[]
  }

  /**
   * KnowledgeChunk findFirstOrThrow
   */
  export type KnowledgeChunkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * Filter, which KnowledgeChunk to fetch.
     */
    where?: KnowledgeChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeChunks to fetch.
     */
    orderBy?: KnowledgeChunkOrderByWithRelationInput | KnowledgeChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KnowledgeChunks.
     */
    cursor?: KnowledgeChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KnowledgeChunks.
     */
    distinct?: KnowledgeChunkScalarFieldEnum | KnowledgeChunkScalarFieldEnum[]
  }

  /**
   * KnowledgeChunk findMany
   */
  export type KnowledgeChunkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * Filter, which KnowledgeChunks to fetch.
     */
    where?: KnowledgeChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeChunks to fetch.
     */
    orderBy?: KnowledgeChunkOrderByWithRelationInput | KnowledgeChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KnowledgeChunks.
     */
    cursor?: KnowledgeChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KnowledgeChunks.
     */
    distinct?: KnowledgeChunkScalarFieldEnum | KnowledgeChunkScalarFieldEnum[]
  }

  /**
   * KnowledgeChunk create
   */
  export type KnowledgeChunkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * The data needed to create a KnowledgeChunk.
     */
    data: XOR<KnowledgeChunkCreateInput, KnowledgeChunkUncheckedCreateInput>
  }

  /**
   * KnowledgeChunk createMany
   */
  export type KnowledgeChunkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KnowledgeChunks.
     */
    data: KnowledgeChunkCreateManyInput | KnowledgeChunkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KnowledgeChunk createManyAndReturn
   */
  export type KnowledgeChunkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * The data used to create many KnowledgeChunks.
     */
    data: KnowledgeChunkCreateManyInput | KnowledgeChunkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KnowledgeChunk update
   */
  export type KnowledgeChunkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * The data needed to update a KnowledgeChunk.
     */
    data: XOR<KnowledgeChunkUpdateInput, KnowledgeChunkUncheckedUpdateInput>
    /**
     * Choose, which KnowledgeChunk to update.
     */
    where: KnowledgeChunkWhereUniqueInput
  }

  /**
   * KnowledgeChunk updateMany
   */
  export type KnowledgeChunkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KnowledgeChunks.
     */
    data: XOR<KnowledgeChunkUpdateManyMutationInput, KnowledgeChunkUncheckedUpdateManyInput>
    /**
     * Filter which KnowledgeChunks to update
     */
    where?: KnowledgeChunkWhereInput
    /**
     * Limit how many KnowledgeChunks to update.
     */
    limit?: number
  }

  /**
   * KnowledgeChunk updateManyAndReturn
   */
  export type KnowledgeChunkUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * The data used to update KnowledgeChunks.
     */
    data: XOR<KnowledgeChunkUpdateManyMutationInput, KnowledgeChunkUncheckedUpdateManyInput>
    /**
     * Filter which KnowledgeChunks to update
     */
    where?: KnowledgeChunkWhereInput
    /**
     * Limit how many KnowledgeChunks to update.
     */
    limit?: number
  }

  /**
   * KnowledgeChunk upsert
   */
  export type KnowledgeChunkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * The filter to search for the KnowledgeChunk to update in case it exists.
     */
    where: KnowledgeChunkWhereUniqueInput
    /**
     * In case the KnowledgeChunk found by the `where` argument doesn't exist, create a new KnowledgeChunk with this data.
     */
    create: XOR<KnowledgeChunkCreateInput, KnowledgeChunkUncheckedCreateInput>
    /**
     * In case the KnowledgeChunk was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KnowledgeChunkUpdateInput, KnowledgeChunkUncheckedUpdateInput>
  }

  /**
   * KnowledgeChunk delete
   */
  export type KnowledgeChunkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * Filter which KnowledgeChunk to delete.
     */
    where: KnowledgeChunkWhereUniqueInput
  }

  /**
   * KnowledgeChunk deleteMany
   */
  export type KnowledgeChunkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KnowledgeChunks to delete
     */
    where?: KnowledgeChunkWhereInput
    /**
     * Limit how many KnowledgeChunks to delete.
     */
    limit?: number
  }

  /**
   * KnowledgeChunk without action
   */
  export type KnowledgeChunkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    name: 'name',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const QuestionScalarFieldEnum: {
    id: 'id',
    content: 'content',
    options: 'options',
    answer: 'answer',
    explanation: 'explanation',
    topic: 'topic',
    difficulty: 'difficulty',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type QuestionScalarFieldEnum = (typeof QuestionScalarFieldEnum)[keyof typeof QuestionScalarFieldEnum]


  export const ExamAttemptScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    totalScore: 'totalScore',
    totalQuestions: 'totalQuestions',
    timeTakenSecs: 'timeTakenSecs',
    topics: 'topics',
    startedAt: 'startedAt',
    submittedAt: 'submittedAt'
  };

  export type ExamAttemptScalarFieldEnum = (typeof ExamAttemptScalarFieldEnum)[keyof typeof ExamAttemptScalarFieldEnum]


  export const ExamAnswerScalarFieldEnum: {
    id: 'id',
    examAttemptId: 'examAttemptId',
    questionId: 'questionId',
    userAnswer: 'userAnswer',
    isCorrect: 'isCorrect'
  };

  export type ExamAnswerScalarFieldEnum = (typeof ExamAnswerScalarFieldEnum)[keyof typeof ExamAnswerScalarFieldEnum]


  export const ChatSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ChatSessionScalarFieldEnum = (typeof ChatSessionScalarFieldEnum)[keyof typeof ChatSessionScalarFieldEnum]


  export const ChatMessageScalarFieldEnum: {
    id: 'id',
    chatSessionId: 'chatSessionId',
    role: 'role',
    content: 'content',
    createdAt: 'createdAt'
  };

  export type ChatMessageScalarFieldEnum = (typeof ChatMessageScalarFieldEnum)[keyof typeof ChatMessageScalarFieldEnum]


  export const KnowledgeChunkScalarFieldEnum: {
    id: 'id',
    content: 'content',
    topic: 'topic',
    source: 'source',
    createdAt: 'createdAt'
  };

  export type KnowledgeChunkScalarFieldEnum = (typeof KnowledgeChunkScalarFieldEnum)[keyof typeof KnowledgeChunkScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Topic'
   */
  export type EnumTopicFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Topic'>
    


  /**
   * Reference to a field of type 'Topic[]'
   */
  export type ListEnumTopicFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Topic[]'>
    


  /**
   * Reference to a field of type 'Difficulty'
   */
  export type EnumDifficultyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Difficulty'>
    


  /**
   * Reference to a field of type 'Difficulty[]'
   */
  export type ListEnumDifficultyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Difficulty[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'MessageRole'
   */
  export type EnumMessageRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageRole'>
    


  /**
   * Reference to a field of type 'MessageRole[]'
   */
  export type ListEnumMessageRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageRole[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    examAttempts?: ExamAttemptListRelationFilter
    chatSessions?: ChatSessionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    examAttempts?: ExamAttemptOrderByRelationAggregateInput
    chatSessions?: ChatSessionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    examAttempts?: ExamAttemptListRelationFilter
    chatSessions?: ChatSessionListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type QuestionWhereInput = {
    AND?: QuestionWhereInput | QuestionWhereInput[]
    OR?: QuestionWhereInput[]
    NOT?: QuestionWhereInput | QuestionWhereInput[]
    id?: StringFilter<"Question"> | string
    content?: StringFilter<"Question"> | string
    options?: JsonFilter<"Question">
    answer?: StringFilter<"Question"> | string
    explanation?: StringFilter<"Question"> | string
    topic?: EnumTopicFilter<"Question"> | $Enums.Topic
    difficulty?: EnumDifficultyFilter<"Question"> | $Enums.Difficulty
    isActive?: BoolFilter<"Question"> | boolean
    createdAt?: DateTimeFilter<"Question"> | Date | string
    updatedAt?: DateTimeFilter<"Question"> | Date | string
    examAnswers?: ExamAnswerListRelationFilter
  }

  export type QuestionOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    options?: SortOrder
    answer?: SortOrder
    explanation?: SortOrder
    topic?: SortOrder
    difficulty?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    examAnswers?: ExamAnswerOrderByRelationAggregateInput
  }

  export type QuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuestionWhereInput | QuestionWhereInput[]
    OR?: QuestionWhereInput[]
    NOT?: QuestionWhereInput | QuestionWhereInput[]
    content?: StringFilter<"Question"> | string
    options?: JsonFilter<"Question">
    answer?: StringFilter<"Question"> | string
    explanation?: StringFilter<"Question"> | string
    topic?: EnumTopicFilter<"Question"> | $Enums.Topic
    difficulty?: EnumDifficultyFilter<"Question"> | $Enums.Difficulty
    isActive?: BoolFilter<"Question"> | boolean
    createdAt?: DateTimeFilter<"Question"> | Date | string
    updatedAt?: DateTimeFilter<"Question"> | Date | string
    examAnswers?: ExamAnswerListRelationFilter
  }, "id">

  export type QuestionOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    options?: SortOrder
    answer?: SortOrder
    explanation?: SortOrder
    topic?: SortOrder
    difficulty?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: QuestionCountOrderByAggregateInput
    _max?: QuestionMaxOrderByAggregateInput
    _min?: QuestionMinOrderByAggregateInput
  }

  export type QuestionScalarWhereWithAggregatesInput = {
    AND?: QuestionScalarWhereWithAggregatesInput | QuestionScalarWhereWithAggregatesInput[]
    OR?: QuestionScalarWhereWithAggregatesInput[]
    NOT?: QuestionScalarWhereWithAggregatesInput | QuestionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Question"> | string
    content?: StringWithAggregatesFilter<"Question"> | string
    options?: JsonWithAggregatesFilter<"Question">
    answer?: StringWithAggregatesFilter<"Question"> | string
    explanation?: StringWithAggregatesFilter<"Question"> | string
    topic?: EnumTopicWithAggregatesFilter<"Question"> | $Enums.Topic
    difficulty?: EnumDifficultyWithAggregatesFilter<"Question"> | $Enums.Difficulty
    isActive?: BoolWithAggregatesFilter<"Question"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Question"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Question"> | Date | string
  }

  export type ExamAttemptWhereInput = {
    AND?: ExamAttemptWhereInput | ExamAttemptWhereInput[]
    OR?: ExamAttemptWhereInput[]
    NOT?: ExamAttemptWhereInput | ExamAttemptWhereInput[]
    id?: StringFilter<"ExamAttempt"> | string
    userId?: StringFilter<"ExamAttempt"> | string
    totalScore?: IntFilter<"ExamAttempt"> | number
    totalQuestions?: IntFilter<"ExamAttempt"> | number
    timeTakenSecs?: IntFilter<"ExamAttempt"> | number
    topics?: EnumTopicNullableListFilter<"ExamAttempt">
    startedAt?: DateTimeFilter<"ExamAttempt"> | Date | string
    submittedAt?: DateTimeFilter<"ExamAttempt"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    answers?: ExamAnswerListRelationFilter
  }

  export type ExamAttemptOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    totalScore?: SortOrder
    totalQuestions?: SortOrder
    timeTakenSecs?: SortOrder
    topics?: SortOrder
    startedAt?: SortOrder
    submittedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    answers?: ExamAnswerOrderByRelationAggregateInput
  }

  export type ExamAttemptWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExamAttemptWhereInput | ExamAttemptWhereInput[]
    OR?: ExamAttemptWhereInput[]
    NOT?: ExamAttemptWhereInput | ExamAttemptWhereInput[]
    userId?: StringFilter<"ExamAttempt"> | string
    totalScore?: IntFilter<"ExamAttempt"> | number
    totalQuestions?: IntFilter<"ExamAttempt"> | number
    timeTakenSecs?: IntFilter<"ExamAttempt"> | number
    topics?: EnumTopicNullableListFilter<"ExamAttempt">
    startedAt?: DateTimeFilter<"ExamAttempt"> | Date | string
    submittedAt?: DateTimeFilter<"ExamAttempt"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    answers?: ExamAnswerListRelationFilter
  }, "id">

  export type ExamAttemptOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    totalScore?: SortOrder
    totalQuestions?: SortOrder
    timeTakenSecs?: SortOrder
    topics?: SortOrder
    startedAt?: SortOrder
    submittedAt?: SortOrder
    _count?: ExamAttemptCountOrderByAggregateInput
    _avg?: ExamAttemptAvgOrderByAggregateInput
    _max?: ExamAttemptMaxOrderByAggregateInput
    _min?: ExamAttemptMinOrderByAggregateInput
    _sum?: ExamAttemptSumOrderByAggregateInput
  }

  export type ExamAttemptScalarWhereWithAggregatesInput = {
    AND?: ExamAttemptScalarWhereWithAggregatesInput | ExamAttemptScalarWhereWithAggregatesInput[]
    OR?: ExamAttemptScalarWhereWithAggregatesInput[]
    NOT?: ExamAttemptScalarWhereWithAggregatesInput | ExamAttemptScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExamAttempt"> | string
    userId?: StringWithAggregatesFilter<"ExamAttempt"> | string
    totalScore?: IntWithAggregatesFilter<"ExamAttempt"> | number
    totalQuestions?: IntWithAggregatesFilter<"ExamAttempt"> | number
    timeTakenSecs?: IntWithAggregatesFilter<"ExamAttempt"> | number
    topics?: EnumTopicNullableListFilter<"ExamAttempt">
    startedAt?: DateTimeWithAggregatesFilter<"ExamAttempt"> | Date | string
    submittedAt?: DateTimeWithAggregatesFilter<"ExamAttempt"> | Date | string
  }

  export type ExamAnswerWhereInput = {
    AND?: ExamAnswerWhereInput | ExamAnswerWhereInput[]
    OR?: ExamAnswerWhereInput[]
    NOT?: ExamAnswerWhereInput | ExamAnswerWhereInput[]
    id?: StringFilter<"ExamAnswer"> | string
    examAttemptId?: StringFilter<"ExamAnswer"> | string
    questionId?: StringFilter<"ExamAnswer"> | string
    userAnswer?: StringNullableFilter<"ExamAnswer"> | string | null
    isCorrect?: BoolFilter<"ExamAnswer"> | boolean
    examAttempt?: XOR<ExamAttemptScalarRelationFilter, ExamAttemptWhereInput>
    question?: XOR<QuestionScalarRelationFilter, QuestionWhereInput>
  }

  export type ExamAnswerOrderByWithRelationInput = {
    id?: SortOrder
    examAttemptId?: SortOrder
    questionId?: SortOrder
    userAnswer?: SortOrderInput | SortOrder
    isCorrect?: SortOrder
    examAttempt?: ExamAttemptOrderByWithRelationInput
    question?: QuestionOrderByWithRelationInput
  }

  export type ExamAnswerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExamAnswerWhereInput | ExamAnswerWhereInput[]
    OR?: ExamAnswerWhereInput[]
    NOT?: ExamAnswerWhereInput | ExamAnswerWhereInput[]
    examAttemptId?: StringFilter<"ExamAnswer"> | string
    questionId?: StringFilter<"ExamAnswer"> | string
    userAnswer?: StringNullableFilter<"ExamAnswer"> | string | null
    isCorrect?: BoolFilter<"ExamAnswer"> | boolean
    examAttempt?: XOR<ExamAttemptScalarRelationFilter, ExamAttemptWhereInput>
    question?: XOR<QuestionScalarRelationFilter, QuestionWhereInput>
  }, "id">

  export type ExamAnswerOrderByWithAggregationInput = {
    id?: SortOrder
    examAttemptId?: SortOrder
    questionId?: SortOrder
    userAnswer?: SortOrderInput | SortOrder
    isCorrect?: SortOrder
    _count?: ExamAnswerCountOrderByAggregateInput
    _max?: ExamAnswerMaxOrderByAggregateInput
    _min?: ExamAnswerMinOrderByAggregateInput
  }

  export type ExamAnswerScalarWhereWithAggregatesInput = {
    AND?: ExamAnswerScalarWhereWithAggregatesInput | ExamAnswerScalarWhereWithAggregatesInput[]
    OR?: ExamAnswerScalarWhereWithAggregatesInput[]
    NOT?: ExamAnswerScalarWhereWithAggregatesInput | ExamAnswerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExamAnswer"> | string
    examAttemptId?: StringWithAggregatesFilter<"ExamAnswer"> | string
    questionId?: StringWithAggregatesFilter<"ExamAnswer"> | string
    userAnswer?: StringNullableWithAggregatesFilter<"ExamAnswer"> | string | null
    isCorrect?: BoolWithAggregatesFilter<"ExamAnswer"> | boolean
  }

  export type ChatSessionWhereInput = {
    AND?: ChatSessionWhereInput | ChatSessionWhereInput[]
    OR?: ChatSessionWhereInput[]
    NOT?: ChatSessionWhereInput | ChatSessionWhereInput[]
    id?: StringFilter<"ChatSession"> | string
    userId?: StringFilter<"ChatSession"> | string
    title?: StringFilter<"ChatSession"> | string
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    messages?: ChatMessageListRelationFilter
  }

  export type ChatSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    messages?: ChatMessageOrderByRelationAggregateInput
  }

  export type ChatSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatSessionWhereInput | ChatSessionWhereInput[]
    OR?: ChatSessionWhereInput[]
    NOT?: ChatSessionWhereInput | ChatSessionWhereInput[]
    userId?: StringFilter<"ChatSession"> | string
    title?: StringFilter<"ChatSession"> | string
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    messages?: ChatMessageListRelationFilter
  }, "id">

  export type ChatSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ChatSessionCountOrderByAggregateInput
    _max?: ChatSessionMaxOrderByAggregateInput
    _min?: ChatSessionMinOrderByAggregateInput
  }

  export type ChatSessionScalarWhereWithAggregatesInput = {
    AND?: ChatSessionScalarWhereWithAggregatesInput | ChatSessionScalarWhereWithAggregatesInput[]
    OR?: ChatSessionScalarWhereWithAggregatesInput[]
    NOT?: ChatSessionScalarWhereWithAggregatesInput | ChatSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatSession"> | string
    userId?: StringWithAggregatesFilter<"ChatSession"> | string
    title?: StringWithAggregatesFilter<"ChatSession"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ChatSession"> | Date | string
  }

  export type ChatMessageWhereInput = {
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    chatSessionId?: StringFilter<"ChatMessage"> | string
    role?: EnumMessageRoleFilter<"ChatMessage"> | $Enums.MessageRole
    content?: StringFilter<"ChatMessage"> | string
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
    chatSession?: XOR<ChatSessionScalarRelationFilter, ChatSessionWhereInput>
  }

  export type ChatMessageOrderByWithRelationInput = {
    id?: SortOrder
    chatSessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    chatSession?: ChatSessionOrderByWithRelationInput
  }

  export type ChatMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    chatSessionId?: StringFilter<"ChatMessage"> | string
    role?: EnumMessageRoleFilter<"ChatMessage"> | $Enums.MessageRole
    content?: StringFilter<"ChatMessage"> | string
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
    chatSession?: XOR<ChatSessionScalarRelationFilter, ChatSessionWhereInput>
  }, "id">

  export type ChatMessageOrderByWithAggregationInput = {
    id?: SortOrder
    chatSessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    _count?: ChatMessageCountOrderByAggregateInput
    _max?: ChatMessageMaxOrderByAggregateInput
    _min?: ChatMessageMinOrderByAggregateInput
  }

  export type ChatMessageScalarWhereWithAggregatesInput = {
    AND?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    OR?: ChatMessageScalarWhereWithAggregatesInput[]
    NOT?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatMessage"> | string
    chatSessionId?: StringWithAggregatesFilter<"ChatMessage"> | string
    role?: EnumMessageRoleWithAggregatesFilter<"ChatMessage"> | $Enums.MessageRole
    content?: StringWithAggregatesFilter<"ChatMessage"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ChatMessage"> | Date | string
  }

  export type KnowledgeChunkWhereInput = {
    AND?: KnowledgeChunkWhereInput | KnowledgeChunkWhereInput[]
    OR?: KnowledgeChunkWhereInput[]
    NOT?: KnowledgeChunkWhereInput | KnowledgeChunkWhereInput[]
    id?: StringFilter<"KnowledgeChunk"> | string
    content?: StringFilter<"KnowledgeChunk"> | string
    topic?: EnumTopicFilter<"KnowledgeChunk"> | $Enums.Topic
    source?: StringFilter<"KnowledgeChunk"> | string
    createdAt?: DateTimeFilter<"KnowledgeChunk"> | Date | string
  }

  export type KnowledgeChunkOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    topic?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type KnowledgeChunkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: KnowledgeChunkWhereInput | KnowledgeChunkWhereInput[]
    OR?: KnowledgeChunkWhereInput[]
    NOT?: KnowledgeChunkWhereInput | KnowledgeChunkWhereInput[]
    content?: StringFilter<"KnowledgeChunk"> | string
    topic?: EnumTopicFilter<"KnowledgeChunk"> | $Enums.Topic
    source?: StringFilter<"KnowledgeChunk"> | string
    createdAt?: DateTimeFilter<"KnowledgeChunk"> | Date | string
  }, "id">

  export type KnowledgeChunkOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    topic?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    _count?: KnowledgeChunkCountOrderByAggregateInput
    _max?: KnowledgeChunkMaxOrderByAggregateInput
    _min?: KnowledgeChunkMinOrderByAggregateInput
  }

  export type KnowledgeChunkScalarWhereWithAggregatesInput = {
    AND?: KnowledgeChunkScalarWhereWithAggregatesInput | KnowledgeChunkScalarWhereWithAggregatesInput[]
    OR?: KnowledgeChunkScalarWhereWithAggregatesInput[]
    NOT?: KnowledgeChunkScalarWhereWithAggregatesInput | KnowledgeChunkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KnowledgeChunk"> | string
    content?: StringWithAggregatesFilter<"KnowledgeChunk"> | string
    topic?: EnumTopicWithAggregatesFilter<"KnowledgeChunk"> | $Enums.Topic
    source?: StringWithAggregatesFilter<"KnowledgeChunk"> | string
    createdAt?: DateTimeWithAggregatesFilter<"KnowledgeChunk"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    examAttempts?: ExamAttemptCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    examAttempts?: ExamAttemptUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    examAttempts?: ExamAttemptUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    examAttempts?: ExamAttemptUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestionCreateInput = {
    id?: string
    content: string
    options: JsonNullValueInput | InputJsonValue
    answer: string
    explanation: string
    topic: $Enums.Topic
    difficulty: $Enums.Difficulty
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    examAnswers?: ExamAnswerCreateNestedManyWithoutQuestionInput
  }

  export type QuestionUncheckedCreateInput = {
    id?: string
    content: string
    options: JsonNullValueInput | InputJsonValue
    answer: string
    explanation: string
    topic: $Enums.Topic
    difficulty: $Enums.Difficulty
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    examAnswers?: ExamAnswerUncheckedCreateNestedManyWithoutQuestionInput
  }

  export type QuestionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    answer?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    topic?: EnumTopicFieldUpdateOperationsInput | $Enums.Topic
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    examAnswers?: ExamAnswerUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    answer?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    topic?: EnumTopicFieldUpdateOperationsInput | $Enums.Topic
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    examAnswers?: ExamAnswerUncheckedUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionCreateManyInput = {
    id?: string
    content: string
    options: JsonNullValueInput | InputJsonValue
    answer: string
    explanation: string
    topic: $Enums.Topic
    difficulty: $Enums.Difficulty
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuestionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    answer?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    topic?: EnumTopicFieldUpdateOperationsInput | $Enums.Topic
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    answer?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    topic?: EnumTopicFieldUpdateOperationsInput | $Enums.Topic
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamAttemptCreateInput = {
    id?: string
    totalScore: number
    totalQuestions: number
    timeTakenSecs: number
    topics?: ExamAttemptCreatetopicsInput | $Enums.Topic[]
    startedAt?: Date | string
    submittedAt?: Date | string
    user: UserCreateNestedOneWithoutExamAttemptsInput
    answers?: ExamAnswerCreateNestedManyWithoutExamAttemptInput
  }

  export type ExamAttemptUncheckedCreateInput = {
    id?: string
    userId: string
    totalScore: number
    totalQuestions: number
    timeTakenSecs: number
    topics?: ExamAttemptCreatetopicsInput | $Enums.Topic[]
    startedAt?: Date | string
    submittedAt?: Date | string
    answers?: ExamAnswerUncheckedCreateNestedManyWithoutExamAttemptInput
  }

  export type ExamAttemptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalScore?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    timeTakenSecs?: IntFieldUpdateOperationsInput | number
    topics?: ExamAttemptUpdatetopicsInput | $Enums.Topic[]
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutExamAttemptsNestedInput
    answers?: ExamAnswerUpdateManyWithoutExamAttemptNestedInput
  }

  export type ExamAttemptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    totalScore?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    timeTakenSecs?: IntFieldUpdateOperationsInput | number
    topics?: ExamAttemptUpdatetopicsInput | $Enums.Topic[]
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    answers?: ExamAnswerUncheckedUpdateManyWithoutExamAttemptNestedInput
  }

  export type ExamAttemptCreateManyInput = {
    id?: string
    userId: string
    totalScore: number
    totalQuestions: number
    timeTakenSecs: number
    topics?: ExamAttemptCreatetopicsInput | $Enums.Topic[]
    startedAt?: Date | string
    submittedAt?: Date | string
  }

  export type ExamAttemptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalScore?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    timeTakenSecs?: IntFieldUpdateOperationsInput | number
    topics?: ExamAttemptUpdatetopicsInput | $Enums.Topic[]
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamAttemptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    totalScore?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    timeTakenSecs?: IntFieldUpdateOperationsInput | number
    topics?: ExamAttemptUpdatetopicsInput | $Enums.Topic[]
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamAnswerCreateInput = {
    id?: string
    userAnswer?: string | null
    isCorrect: boolean
    examAttempt: ExamAttemptCreateNestedOneWithoutAnswersInput
    question: QuestionCreateNestedOneWithoutExamAnswersInput
  }

  export type ExamAnswerUncheckedCreateInput = {
    id?: string
    examAttemptId: string
    questionId: string
    userAnswer?: string | null
    isCorrect: boolean
  }

  export type ExamAnswerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    examAttempt?: ExamAttemptUpdateOneRequiredWithoutAnswersNestedInput
    question?: QuestionUpdateOneRequiredWithoutExamAnswersNestedInput
  }

  export type ExamAnswerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    examAttemptId?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    userAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ExamAnswerCreateManyInput = {
    id?: string
    examAttemptId: string
    questionId: string
    userAnswer?: string | null
    isCorrect: boolean
  }

  export type ExamAnswerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ExamAnswerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    examAttemptId?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    userAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ChatSessionCreateInput = {
    id?: string
    title?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutChatSessionsInput
    messages?: ChatMessageCreateNestedManyWithoutChatSessionInput
  }

  export type ChatSessionUncheckedCreateInput = {
    id?: string
    userId: string
    title?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutChatSessionInput
  }

  export type ChatSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutChatSessionsNestedInput
    messages?: ChatMessageUpdateManyWithoutChatSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUncheckedUpdateManyWithoutChatSessionNestedInput
  }

  export type ChatSessionCreateManyInput = {
    id?: string
    userId: string
    title?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChatSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    createdAt?: Date | string
    chatSession: ChatSessionCreateNestedOneWithoutMessagesInput
  }

  export type ChatMessageUncheckedCreateInput = {
    id?: string
    chatSessionId: string
    role: $Enums.MessageRole
    content: string
    createdAt?: Date | string
  }

  export type ChatMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chatSession?: ChatSessionUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type ChatMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatSessionId?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateManyInput = {
    id?: string
    chatSessionId: string
    role: $Enums.MessageRole
    content: string
    createdAt?: Date | string
  }

  export type ChatMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatSessionId?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeChunkCreateInput = {
    id?: string
    content: string
    topic: $Enums.Topic
    source: string
    createdAt?: Date | string
  }

  export type KnowledgeChunkUncheckedCreateInput = {
    id?: string
    content: string
    topic: $Enums.Topic
    source: string
    createdAt?: Date | string
  }

  export type KnowledgeChunkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    topic?: EnumTopicFieldUpdateOperationsInput | $Enums.Topic
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeChunkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    topic?: EnumTopicFieldUpdateOperationsInput | $Enums.Topic
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeChunkCreateManyInput = {
    id?: string
    content: string
    topic: $Enums.Topic
    source: string
    createdAt?: Date | string
  }

  export type KnowledgeChunkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    topic?: EnumTopicFieldUpdateOperationsInput | $Enums.Topic
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeChunkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    topic?: EnumTopicFieldUpdateOperationsInput | $Enums.Topic
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ExamAttemptListRelationFilter = {
    every?: ExamAttemptWhereInput
    some?: ExamAttemptWhereInput
    none?: ExamAttemptWhereInput
  }

  export type ChatSessionListRelationFilter = {
    every?: ChatSessionWhereInput
    some?: ChatSessionWhereInput
    none?: ChatSessionWhereInput
  }

  export type ExamAttemptOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumTopicFilter<$PrismaModel = never> = {
    equals?: $Enums.Topic | EnumTopicFieldRefInput<$PrismaModel>
    in?: $Enums.Topic[] | ListEnumTopicFieldRefInput<$PrismaModel>
    notIn?: $Enums.Topic[] | ListEnumTopicFieldRefInput<$PrismaModel>
    not?: NestedEnumTopicFilter<$PrismaModel> | $Enums.Topic
  }

  export type EnumDifficultyFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumDifficultyFilter<$PrismaModel> | $Enums.Difficulty
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ExamAnswerListRelationFilter = {
    every?: ExamAnswerWhereInput
    some?: ExamAnswerWhereInput
    none?: ExamAnswerWhereInput
  }

  export type ExamAnswerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuestionCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    options?: SortOrder
    answer?: SortOrder
    explanation?: SortOrder
    topic?: SortOrder
    difficulty?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuestionMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    answer?: SortOrder
    explanation?: SortOrder
    topic?: SortOrder
    difficulty?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuestionMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    answer?: SortOrder
    explanation?: SortOrder
    topic?: SortOrder
    difficulty?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumTopicWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Topic | EnumTopicFieldRefInput<$PrismaModel>
    in?: $Enums.Topic[] | ListEnumTopicFieldRefInput<$PrismaModel>
    notIn?: $Enums.Topic[] | ListEnumTopicFieldRefInput<$PrismaModel>
    not?: NestedEnumTopicWithAggregatesFilter<$PrismaModel> | $Enums.Topic
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTopicFilter<$PrismaModel>
    _max?: NestedEnumTopicFilter<$PrismaModel>
  }

  export type EnumDifficultyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumDifficultyWithAggregatesFilter<$PrismaModel> | $Enums.Difficulty
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDifficultyFilter<$PrismaModel>
    _max?: NestedEnumDifficultyFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumTopicNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.Topic[] | ListEnumTopicFieldRefInput<$PrismaModel> | null
    has?: $Enums.Topic | EnumTopicFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.Topic[] | ListEnumTopicFieldRefInput<$PrismaModel>
    hasSome?: $Enums.Topic[] | ListEnumTopicFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ExamAttemptCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    totalScore?: SortOrder
    totalQuestions?: SortOrder
    timeTakenSecs?: SortOrder
    topics?: SortOrder
    startedAt?: SortOrder
    submittedAt?: SortOrder
  }

  export type ExamAttemptAvgOrderByAggregateInput = {
    totalScore?: SortOrder
    totalQuestions?: SortOrder
    timeTakenSecs?: SortOrder
  }

  export type ExamAttemptMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    totalScore?: SortOrder
    totalQuestions?: SortOrder
    timeTakenSecs?: SortOrder
    startedAt?: SortOrder
    submittedAt?: SortOrder
  }

  export type ExamAttemptMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    totalScore?: SortOrder
    totalQuestions?: SortOrder
    timeTakenSecs?: SortOrder
    startedAt?: SortOrder
    submittedAt?: SortOrder
  }

  export type ExamAttemptSumOrderByAggregateInput = {
    totalScore?: SortOrder
    totalQuestions?: SortOrder
    timeTakenSecs?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type ExamAttemptScalarRelationFilter = {
    is?: ExamAttemptWhereInput
    isNot?: ExamAttemptWhereInput
  }

  export type QuestionScalarRelationFilter = {
    is?: QuestionWhereInput
    isNot?: QuestionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ExamAnswerCountOrderByAggregateInput = {
    id?: SortOrder
    examAttemptId?: SortOrder
    questionId?: SortOrder
    userAnswer?: SortOrder
    isCorrect?: SortOrder
  }

  export type ExamAnswerMaxOrderByAggregateInput = {
    id?: SortOrder
    examAttemptId?: SortOrder
    questionId?: SortOrder
    userAnswer?: SortOrder
    isCorrect?: SortOrder
  }

  export type ExamAnswerMinOrderByAggregateInput = {
    id?: SortOrder
    examAttemptId?: SortOrder
    questionId?: SortOrder
    userAnswer?: SortOrder
    isCorrect?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type ChatMessageListRelationFilter = {
    every?: ChatMessageWhereInput
    some?: ChatMessageWhereInput
    none?: ChatMessageWhereInput
  }

  export type ChatMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChatSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChatSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumMessageRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleFilter<$PrismaModel> | $Enums.MessageRole
  }

  export type ChatSessionScalarRelationFilter = {
    is?: ChatSessionWhereInput
    isNot?: ChatSessionWhereInput
  }

  export type ChatMessageCountOrderByAggregateInput = {
    id?: SortOrder
    chatSessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    chatSessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatMessageMinOrderByAggregateInput = {
    id?: SortOrder
    chatSessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumMessageRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel> | $Enums.MessageRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageRoleFilter<$PrismaModel>
    _max?: NestedEnumMessageRoleFilter<$PrismaModel>
  }

  export type KnowledgeChunkCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    topic?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type KnowledgeChunkMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    topic?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type KnowledgeChunkMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    topic?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type ExamAttemptCreateNestedManyWithoutUserInput = {
    create?: XOR<ExamAttemptCreateWithoutUserInput, ExamAttemptUncheckedCreateWithoutUserInput> | ExamAttemptCreateWithoutUserInput[] | ExamAttemptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExamAttemptCreateOrConnectWithoutUserInput | ExamAttemptCreateOrConnectWithoutUserInput[]
    createMany?: ExamAttemptCreateManyUserInputEnvelope
    connect?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
  }

  export type ChatSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
  }

  export type ExamAttemptUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ExamAttemptCreateWithoutUserInput, ExamAttemptUncheckedCreateWithoutUserInput> | ExamAttemptCreateWithoutUserInput[] | ExamAttemptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExamAttemptCreateOrConnectWithoutUserInput | ExamAttemptCreateOrConnectWithoutUserInput[]
    createMany?: ExamAttemptCreateManyUserInputEnvelope
    connect?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
  }

  export type ChatSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ExamAttemptUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExamAttemptCreateWithoutUserInput, ExamAttemptUncheckedCreateWithoutUserInput> | ExamAttemptCreateWithoutUserInput[] | ExamAttemptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExamAttemptCreateOrConnectWithoutUserInput | ExamAttemptCreateOrConnectWithoutUserInput[]
    upsert?: ExamAttemptUpsertWithWhereUniqueWithoutUserInput | ExamAttemptUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExamAttemptCreateManyUserInputEnvelope
    set?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
    disconnect?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
    delete?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
    connect?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
    update?: ExamAttemptUpdateWithWhereUniqueWithoutUserInput | ExamAttemptUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExamAttemptUpdateManyWithWhereWithoutUserInput | ExamAttemptUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExamAttemptScalarWhereInput | ExamAttemptScalarWhereInput[]
  }

  export type ChatSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    upsert?: ChatSessionUpsertWithWhereUniqueWithoutUserInput | ChatSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    set?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    disconnect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    delete?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    update?: ChatSessionUpdateWithWhereUniqueWithoutUserInput | ChatSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatSessionUpdateManyWithWhereWithoutUserInput | ChatSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
  }

  export type ExamAttemptUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExamAttemptCreateWithoutUserInput, ExamAttemptUncheckedCreateWithoutUserInput> | ExamAttemptCreateWithoutUserInput[] | ExamAttemptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExamAttemptCreateOrConnectWithoutUserInput | ExamAttemptCreateOrConnectWithoutUserInput[]
    upsert?: ExamAttemptUpsertWithWhereUniqueWithoutUserInput | ExamAttemptUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExamAttemptCreateManyUserInputEnvelope
    set?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
    disconnect?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
    delete?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
    connect?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
    update?: ExamAttemptUpdateWithWhereUniqueWithoutUserInput | ExamAttemptUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExamAttemptUpdateManyWithWhereWithoutUserInput | ExamAttemptUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExamAttemptScalarWhereInput | ExamAttemptScalarWhereInput[]
  }

  export type ChatSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    upsert?: ChatSessionUpsertWithWhereUniqueWithoutUserInput | ChatSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    set?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    disconnect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    delete?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    update?: ChatSessionUpdateWithWhereUniqueWithoutUserInput | ChatSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatSessionUpdateManyWithWhereWithoutUserInput | ChatSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
  }

  export type ExamAnswerCreateNestedManyWithoutQuestionInput = {
    create?: XOR<ExamAnswerCreateWithoutQuestionInput, ExamAnswerUncheckedCreateWithoutQuestionInput> | ExamAnswerCreateWithoutQuestionInput[] | ExamAnswerUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: ExamAnswerCreateOrConnectWithoutQuestionInput | ExamAnswerCreateOrConnectWithoutQuestionInput[]
    createMany?: ExamAnswerCreateManyQuestionInputEnvelope
    connect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
  }

  export type ExamAnswerUncheckedCreateNestedManyWithoutQuestionInput = {
    create?: XOR<ExamAnswerCreateWithoutQuestionInput, ExamAnswerUncheckedCreateWithoutQuestionInput> | ExamAnswerCreateWithoutQuestionInput[] | ExamAnswerUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: ExamAnswerCreateOrConnectWithoutQuestionInput | ExamAnswerCreateOrConnectWithoutQuestionInput[]
    createMany?: ExamAnswerCreateManyQuestionInputEnvelope
    connect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
  }

  export type EnumTopicFieldUpdateOperationsInput = {
    set?: $Enums.Topic
  }

  export type EnumDifficultyFieldUpdateOperationsInput = {
    set?: $Enums.Difficulty
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ExamAnswerUpdateManyWithoutQuestionNestedInput = {
    create?: XOR<ExamAnswerCreateWithoutQuestionInput, ExamAnswerUncheckedCreateWithoutQuestionInput> | ExamAnswerCreateWithoutQuestionInput[] | ExamAnswerUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: ExamAnswerCreateOrConnectWithoutQuestionInput | ExamAnswerCreateOrConnectWithoutQuestionInput[]
    upsert?: ExamAnswerUpsertWithWhereUniqueWithoutQuestionInput | ExamAnswerUpsertWithWhereUniqueWithoutQuestionInput[]
    createMany?: ExamAnswerCreateManyQuestionInputEnvelope
    set?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    disconnect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    delete?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    connect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    update?: ExamAnswerUpdateWithWhereUniqueWithoutQuestionInput | ExamAnswerUpdateWithWhereUniqueWithoutQuestionInput[]
    updateMany?: ExamAnswerUpdateManyWithWhereWithoutQuestionInput | ExamAnswerUpdateManyWithWhereWithoutQuestionInput[]
    deleteMany?: ExamAnswerScalarWhereInput | ExamAnswerScalarWhereInput[]
  }

  export type ExamAnswerUncheckedUpdateManyWithoutQuestionNestedInput = {
    create?: XOR<ExamAnswerCreateWithoutQuestionInput, ExamAnswerUncheckedCreateWithoutQuestionInput> | ExamAnswerCreateWithoutQuestionInput[] | ExamAnswerUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: ExamAnswerCreateOrConnectWithoutQuestionInput | ExamAnswerCreateOrConnectWithoutQuestionInput[]
    upsert?: ExamAnswerUpsertWithWhereUniqueWithoutQuestionInput | ExamAnswerUpsertWithWhereUniqueWithoutQuestionInput[]
    createMany?: ExamAnswerCreateManyQuestionInputEnvelope
    set?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    disconnect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    delete?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    connect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    update?: ExamAnswerUpdateWithWhereUniqueWithoutQuestionInput | ExamAnswerUpdateWithWhereUniqueWithoutQuestionInput[]
    updateMany?: ExamAnswerUpdateManyWithWhereWithoutQuestionInput | ExamAnswerUpdateManyWithWhereWithoutQuestionInput[]
    deleteMany?: ExamAnswerScalarWhereInput | ExamAnswerScalarWhereInput[]
  }

  export type ExamAttemptCreatetopicsInput = {
    set: $Enums.Topic[]
  }

  export type UserCreateNestedOneWithoutExamAttemptsInput = {
    create?: XOR<UserCreateWithoutExamAttemptsInput, UserUncheckedCreateWithoutExamAttemptsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExamAttemptsInput
    connect?: UserWhereUniqueInput
  }

  export type ExamAnswerCreateNestedManyWithoutExamAttemptInput = {
    create?: XOR<ExamAnswerCreateWithoutExamAttemptInput, ExamAnswerUncheckedCreateWithoutExamAttemptInput> | ExamAnswerCreateWithoutExamAttemptInput[] | ExamAnswerUncheckedCreateWithoutExamAttemptInput[]
    connectOrCreate?: ExamAnswerCreateOrConnectWithoutExamAttemptInput | ExamAnswerCreateOrConnectWithoutExamAttemptInput[]
    createMany?: ExamAnswerCreateManyExamAttemptInputEnvelope
    connect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
  }

  export type ExamAnswerUncheckedCreateNestedManyWithoutExamAttemptInput = {
    create?: XOR<ExamAnswerCreateWithoutExamAttemptInput, ExamAnswerUncheckedCreateWithoutExamAttemptInput> | ExamAnswerCreateWithoutExamAttemptInput[] | ExamAnswerUncheckedCreateWithoutExamAttemptInput[]
    connectOrCreate?: ExamAnswerCreateOrConnectWithoutExamAttemptInput | ExamAnswerCreateOrConnectWithoutExamAttemptInput[]
    createMany?: ExamAnswerCreateManyExamAttemptInputEnvelope
    connect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ExamAttemptUpdatetopicsInput = {
    set?: $Enums.Topic[]
    push?: $Enums.Topic | $Enums.Topic[]
  }

  export type UserUpdateOneRequiredWithoutExamAttemptsNestedInput = {
    create?: XOR<UserCreateWithoutExamAttemptsInput, UserUncheckedCreateWithoutExamAttemptsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExamAttemptsInput
    upsert?: UserUpsertWithoutExamAttemptsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutExamAttemptsInput, UserUpdateWithoutExamAttemptsInput>, UserUncheckedUpdateWithoutExamAttemptsInput>
  }

  export type ExamAnswerUpdateManyWithoutExamAttemptNestedInput = {
    create?: XOR<ExamAnswerCreateWithoutExamAttemptInput, ExamAnswerUncheckedCreateWithoutExamAttemptInput> | ExamAnswerCreateWithoutExamAttemptInput[] | ExamAnswerUncheckedCreateWithoutExamAttemptInput[]
    connectOrCreate?: ExamAnswerCreateOrConnectWithoutExamAttemptInput | ExamAnswerCreateOrConnectWithoutExamAttemptInput[]
    upsert?: ExamAnswerUpsertWithWhereUniqueWithoutExamAttemptInput | ExamAnswerUpsertWithWhereUniqueWithoutExamAttemptInput[]
    createMany?: ExamAnswerCreateManyExamAttemptInputEnvelope
    set?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    disconnect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    delete?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    connect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    update?: ExamAnswerUpdateWithWhereUniqueWithoutExamAttemptInput | ExamAnswerUpdateWithWhereUniqueWithoutExamAttemptInput[]
    updateMany?: ExamAnswerUpdateManyWithWhereWithoutExamAttemptInput | ExamAnswerUpdateManyWithWhereWithoutExamAttemptInput[]
    deleteMany?: ExamAnswerScalarWhereInput | ExamAnswerScalarWhereInput[]
  }

  export type ExamAnswerUncheckedUpdateManyWithoutExamAttemptNestedInput = {
    create?: XOR<ExamAnswerCreateWithoutExamAttemptInput, ExamAnswerUncheckedCreateWithoutExamAttemptInput> | ExamAnswerCreateWithoutExamAttemptInput[] | ExamAnswerUncheckedCreateWithoutExamAttemptInput[]
    connectOrCreate?: ExamAnswerCreateOrConnectWithoutExamAttemptInput | ExamAnswerCreateOrConnectWithoutExamAttemptInput[]
    upsert?: ExamAnswerUpsertWithWhereUniqueWithoutExamAttemptInput | ExamAnswerUpsertWithWhereUniqueWithoutExamAttemptInput[]
    createMany?: ExamAnswerCreateManyExamAttemptInputEnvelope
    set?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    disconnect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    delete?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    connect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    update?: ExamAnswerUpdateWithWhereUniqueWithoutExamAttemptInput | ExamAnswerUpdateWithWhereUniqueWithoutExamAttemptInput[]
    updateMany?: ExamAnswerUpdateManyWithWhereWithoutExamAttemptInput | ExamAnswerUpdateManyWithWhereWithoutExamAttemptInput[]
    deleteMany?: ExamAnswerScalarWhereInput | ExamAnswerScalarWhereInput[]
  }

  export type ExamAttemptCreateNestedOneWithoutAnswersInput = {
    create?: XOR<ExamAttemptCreateWithoutAnswersInput, ExamAttemptUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: ExamAttemptCreateOrConnectWithoutAnswersInput
    connect?: ExamAttemptWhereUniqueInput
  }

  export type QuestionCreateNestedOneWithoutExamAnswersInput = {
    create?: XOR<QuestionCreateWithoutExamAnswersInput, QuestionUncheckedCreateWithoutExamAnswersInput>
    connectOrCreate?: QuestionCreateOrConnectWithoutExamAnswersInput
    connect?: QuestionWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type ExamAttemptUpdateOneRequiredWithoutAnswersNestedInput = {
    create?: XOR<ExamAttemptCreateWithoutAnswersInput, ExamAttemptUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: ExamAttemptCreateOrConnectWithoutAnswersInput
    upsert?: ExamAttemptUpsertWithoutAnswersInput
    connect?: ExamAttemptWhereUniqueInput
    update?: XOR<XOR<ExamAttemptUpdateToOneWithWhereWithoutAnswersInput, ExamAttemptUpdateWithoutAnswersInput>, ExamAttemptUncheckedUpdateWithoutAnswersInput>
  }

  export type QuestionUpdateOneRequiredWithoutExamAnswersNestedInput = {
    create?: XOR<QuestionCreateWithoutExamAnswersInput, QuestionUncheckedCreateWithoutExamAnswersInput>
    connectOrCreate?: QuestionCreateOrConnectWithoutExamAnswersInput
    upsert?: QuestionUpsertWithoutExamAnswersInput
    connect?: QuestionWhereUniqueInput
    update?: XOR<XOR<QuestionUpdateToOneWithWhereWithoutExamAnswersInput, QuestionUpdateWithoutExamAnswersInput>, QuestionUncheckedUpdateWithoutExamAnswersInput>
  }

  export type UserCreateNestedOneWithoutChatSessionsInput = {
    create?: XOR<UserCreateWithoutChatSessionsInput, UserUncheckedCreateWithoutChatSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutChatSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type ChatMessageCreateNestedManyWithoutChatSessionInput = {
    create?: XOR<ChatMessageCreateWithoutChatSessionInput, ChatMessageUncheckedCreateWithoutChatSessionInput> | ChatMessageCreateWithoutChatSessionInput[] | ChatMessageUncheckedCreateWithoutChatSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutChatSessionInput | ChatMessageCreateOrConnectWithoutChatSessionInput[]
    createMany?: ChatMessageCreateManyChatSessionInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type ChatMessageUncheckedCreateNestedManyWithoutChatSessionInput = {
    create?: XOR<ChatMessageCreateWithoutChatSessionInput, ChatMessageUncheckedCreateWithoutChatSessionInput> | ChatMessageCreateWithoutChatSessionInput[] | ChatMessageUncheckedCreateWithoutChatSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutChatSessionInput | ChatMessageCreateOrConnectWithoutChatSessionInput[]
    createMany?: ChatMessageCreateManyChatSessionInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutChatSessionsNestedInput = {
    create?: XOR<UserCreateWithoutChatSessionsInput, UserUncheckedCreateWithoutChatSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutChatSessionsInput
    upsert?: UserUpsertWithoutChatSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutChatSessionsInput, UserUpdateWithoutChatSessionsInput>, UserUncheckedUpdateWithoutChatSessionsInput>
  }

  export type ChatMessageUpdateManyWithoutChatSessionNestedInput = {
    create?: XOR<ChatMessageCreateWithoutChatSessionInput, ChatMessageUncheckedCreateWithoutChatSessionInput> | ChatMessageCreateWithoutChatSessionInput[] | ChatMessageUncheckedCreateWithoutChatSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutChatSessionInput | ChatMessageCreateOrConnectWithoutChatSessionInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutChatSessionInput | ChatMessageUpsertWithWhereUniqueWithoutChatSessionInput[]
    createMany?: ChatMessageCreateManyChatSessionInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutChatSessionInput | ChatMessageUpdateWithWhereUniqueWithoutChatSessionInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutChatSessionInput | ChatMessageUpdateManyWithWhereWithoutChatSessionInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type ChatMessageUncheckedUpdateManyWithoutChatSessionNestedInput = {
    create?: XOR<ChatMessageCreateWithoutChatSessionInput, ChatMessageUncheckedCreateWithoutChatSessionInput> | ChatMessageCreateWithoutChatSessionInput[] | ChatMessageUncheckedCreateWithoutChatSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutChatSessionInput | ChatMessageCreateOrConnectWithoutChatSessionInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutChatSessionInput | ChatMessageUpsertWithWhereUniqueWithoutChatSessionInput[]
    createMany?: ChatMessageCreateManyChatSessionInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutChatSessionInput | ChatMessageUpdateWithWhereUniqueWithoutChatSessionInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutChatSessionInput | ChatMessageUpdateManyWithWhereWithoutChatSessionInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type ChatSessionCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutMessagesInput
    connect?: ChatSessionWhereUniqueInput
  }

  export type EnumMessageRoleFieldUpdateOperationsInput = {
    set?: $Enums.MessageRole
  }

  export type ChatSessionUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutMessagesInput
    upsert?: ChatSessionUpsertWithoutMessagesInput
    connect?: ChatSessionWhereUniqueInput
    update?: XOR<XOR<ChatSessionUpdateToOneWithWhereWithoutMessagesInput, ChatSessionUpdateWithoutMessagesInput>, ChatSessionUncheckedUpdateWithoutMessagesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumTopicFilter<$PrismaModel = never> = {
    equals?: $Enums.Topic | EnumTopicFieldRefInput<$PrismaModel>
    in?: $Enums.Topic[] | ListEnumTopicFieldRefInput<$PrismaModel>
    notIn?: $Enums.Topic[] | ListEnumTopicFieldRefInput<$PrismaModel>
    not?: NestedEnumTopicFilter<$PrismaModel> | $Enums.Topic
  }

  export type NestedEnumDifficultyFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumDifficultyFilter<$PrismaModel> | $Enums.Difficulty
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumTopicWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Topic | EnumTopicFieldRefInput<$PrismaModel>
    in?: $Enums.Topic[] | ListEnumTopicFieldRefInput<$PrismaModel>
    notIn?: $Enums.Topic[] | ListEnumTopicFieldRefInput<$PrismaModel>
    not?: NestedEnumTopicWithAggregatesFilter<$PrismaModel> | $Enums.Topic
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTopicFilter<$PrismaModel>
    _max?: NestedEnumTopicFilter<$PrismaModel>
  }

  export type NestedEnumDifficultyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumDifficultyWithAggregatesFilter<$PrismaModel> | $Enums.Difficulty
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDifficultyFilter<$PrismaModel>
    _max?: NestedEnumDifficultyFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumMessageRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleFilter<$PrismaModel> | $Enums.MessageRole
  }

  export type NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel> | $Enums.MessageRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageRoleFilter<$PrismaModel>
    _max?: NestedEnumMessageRoleFilter<$PrismaModel>
  }

  export type ExamAttemptCreateWithoutUserInput = {
    id?: string
    totalScore: number
    totalQuestions: number
    timeTakenSecs: number
    topics?: ExamAttemptCreatetopicsInput | $Enums.Topic[]
    startedAt?: Date | string
    submittedAt?: Date | string
    answers?: ExamAnswerCreateNestedManyWithoutExamAttemptInput
  }

  export type ExamAttemptUncheckedCreateWithoutUserInput = {
    id?: string
    totalScore: number
    totalQuestions: number
    timeTakenSecs: number
    topics?: ExamAttemptCreatetopicsInput | $Enums.Topic[]
    startedAt?: Date | string
    submittedAt?: Date | string
    answers?: ExamAnswerUncheckedCreateNestedManyWithoutExamAttemptInput
  }

  export type ExamAttemptCreateOrConnectWithoutUserInput = {
    where: ExamAttemptWhereUniqueInput
    create: XOR<ExamAttemptCreateWithoutUserInput, ExamAttemptUncheckedCreateWithoutUserInput>
  }

  export type ExamAttemptCreateManyUserInputEnvelope = {
    data: ExamAttemptCreateManyUserInput | ExamAttemptCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ChatSessionCreateWithoutUserInput = {
    id?: string
    title?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageCreateNestedManyWithoutChatSessionInput
  }

  export type ChatSessionUncheckedCreateWithoutUserInput = {
    id?: string
    title?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutChatSessionInput
  }

  export type ChatSessionCreateOrConnectWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput>
  }

  export type ChatSessionCreateManyUserInputEnvelope = {
    data: ChatSessionCreateManyUserInput | ChatSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ExamAttemptUpsertWithWhereUniqueWithoutUserInput = {
    where: ExamAttemptWhereUniqueInput
    update: XOR<ExamAttemptUpdateWithoutUserInput, ExamAttemptUncheckedUpdateWithoutUserInput>
    create: XOR<ExamAttemptCreateWithoutUserInput, ExamAttemptUncheckedCreateWithoutUserInput>
  }

  export type ExamAttemptUpdateWithWhereUniqueWithoutUserInput = {
    where: ExamAttemptWhereUniqueInput
    data: XOR<ExamAttemptUpdateWithoutUserInput, ExamAttemptUncheckedUpdateWithoutUserInput>
  }

  export type ExamAttemptUpdateManyWithWhereWithoutUserInput = {
    where: ExamAttemptScalarWhereInput
    data: XOR<ExamAttemptUpdateManyMutationInput, ExamAttemptUncheckedUpdateManyWithoutUserInput>
  }

  export type ExamAttemptScalarWhereInput = {
    AND?: ExamAttemptScalarWhereInput | ExamAttemptScalarWhereInput[]
    OR?: ExamAttemptScalarWhereInput[]
    NOT?: ExamAttemptScalarWhereInput | ExamAttemptScalarWhereInput[]
    id?: StringFilter<"ExamAttempt"> | string
    userId?: StringFilter<"ExamAttempt"> | string
    totalScore?: IntFilter<"ExamAttempt"> | number
    totalQuestions?: IntFilter<"ExamAttempt"> | number
    timeTakenSecs?: IntFilter<"ExamAttempt"> | number
    topics?: EnumTopicNullableListFilter<"ExamAttempt">
    startedAt?: DateTimeFilter<"ExamAttempt"> | Date | string
    submittedAt?: DateTimeFilter<"ExamAttempt"> | Date | string
  }

  export type ChatSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    update: XOR<ChatSessionUpdateWithoutUserInput, ChatSessionUncheckedUpdateWithoutUserInput>
    create: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput>
  }

  export type ChatSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    data: XOR<ChatSessionUpdateWithoutUserInput, ChatSessionUncheckedUpdateWithoutUserInput>
  }

  export type ChatSessionUpdateManyWithWhereWithoutUserInput = {
    where: ChatSessionScalarWhereInput
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type ChatSessionScalarWhereInput = {
    AND?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
    OR?: ChatSessionScalarWhereInput[]
    NOT?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
    id?: StringFilter<"ChatSession"> | string
    userId?: StringFilter<"ChatSession"> | string
    title?: StringFilter<"ChatSession"> | string
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
  }

  export type ExamAnswerCreateWithoutQuestionInput = {
    id?: string
    userAnswer?: string | null
    isCorrect: boolean
    examAttempt: ExamAttemptCreateNestedOneWithoutAnswersInput
  }

  export type ExamAnswerUncheckedCreateWithoutQuestionInput = {
    id?: string
    examAttemptId: string
    userAnswer?: string | null
    isCorrect: boolean
  }

  export type ExamAnswerCreateOrConnectWithoutQuestionInput = {
    where: ExamAnswerWhereUniqueInput
    create: XOR<ExamAnswerCreateWithoutQuestionInput, ExamAnswerUncheckedCreateWithoutQuestionInput>
  }

  export type ExamAnswerCreateManyQuestionInputEnvelope = {
    data: ExamAnswerCreateManyQuestionInput | ExamAnswerCreateManyQuestionInput[]
    skipDuplicates?: boolean
  }

  export type ExamAnswerUpsertWithWhereUniqueWithoutQuestionInput = {
    where: ExamAnswerWhereUniqueInput
    update: XOR<ExamAnswerUpdateWithoutQuestionInput, ExamAnswerUncheckedUpdateWithoutQuestionInput>
    create: XOR<ExamAnswerCreateWithoutQuestionInput, ExamAnswerUncheckedCreateWithoutQuestionInput>
  }

  export type ExamAnswerUpdateWithWhereUniqueWithoutQuestionInput = {
    where: ExamAnswerWhereUniqueInput
    data: XOR<ExamAnswerUpdateWithoutQuestionInput, ExamAnswerUncheckedUpdateWithoutQuestionInput>
  }

  export type ExamAnswerUpdateManyWithWhereWithoutQuestionInput = {
    where: ExamAnswerScalarWhereInput
    data: XOR<ExamAnswerUpdateManyMutationInput, ExamAnswerUncheckedUpdateManyWithoutQuestionInput>
  }

  export type ExamAnswerScalarWhereInput = {
    AND?: ExamAnswerScalarWhereInput | ExamAnswerScalarWhereInput[]
    OR?: ExamAnswerScalarWhereInput[]
    NOT?: ExamAnswerScalarWhereInput | ExamAnswerScalarWhereInput[]
    id?: StringFilter<"ExamAnswer"> | string
    examAttemptId?: StringFilter<"ExamAnswer"> | string
    questionId?: StringFilter<"ExamAnswer"> | string
    userAnswer?: StringNullableFilter<"ExamAnswer"> | string | null
    isCorrect?: BoolFilter<"ExamAnswer"> | boolean
  }

  export type UserCreateWithoutExamAttemptsInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutExamAttemptsInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutExamAttemptsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutExamAttemptsInput, UserUncheckedCreateWithoutExamAttemptsInput>
  }

  export type ExamAnswerCreateWithoutExamAttemptInput = {
    id?: string
    userAnswer?: string | null
    isCorrect: boolean
    question: QuestionCreateNestedOneWithoutExamAnswersInput
  }

  export type ExamAnswerUncheckedCreateWithoutExamAttemptInput = {
    id?: string
    questionId: string
    userAnswer?: string | null
    isCorrect: boolean
  }

  export type ExamAnswerCreateOrConnectWithoutExamAttemptInput = {
    where: ExamAnswerWhereUniqueInput
    create: XOR<ExamAnswerCreateWithoutExamAttemptInput, ExamAnswerUncheckedCreateWithoutExamAttemptInput>
  }

  export type ExamAnswerCreateManyExamAttemptInputEnvelope = {
    data: ExamAnswerCreateManyExamAttemptInput | ExamAnswerCreateManyExamAttemptInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutExamAttemptsInput = {
    update: XOR<UserUpdateWithoutExamAttemptsInput, UserUncheckedUpdateWithoutExamAttemptsInput>
    create: XOR<UserCreateWithoutExamAttemptsInput, UserUncheckedCreateWithoutExamAttemptsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutExamAttemptsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutExamAttemptsInput, UserUncheckedUpdateWithoutExamAttemptsInput>
  }

  export type UserUpdateWithoutExamAttemptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutExamAttemptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ExamAnswerUpsertWithWhereUniqueWithoutExamAttemptInput = {
    where: ExamAnswerWhereUniqueInput
    update: XOR<ExamAnswerUpdateWithoutExamAttemptInput, ExamAnswerUncheckedUpdateWithoutExamAttemptInput>
    create: XOR<ExamAnswerCreateWithoutExamAttemptInput, ExamAnswerUncheckedCreateWithoutExamAttemptInput>
  }

  export type ExamAnswerUpdateWithWhereUniqueWithoutExamAttemptInput = {
    where: ExamAnswerWhereUniqueInput
    data: XOR<ExamAnswerUpdateWithoutExamAttemptInput, ExamAnswerUncheckedUpdateWithoutExamAttemptInput>
  }

  export type ExamAnswerUpdateManyWithWhereWithoutExamAttemptInput = {
    where: ExamAnswerScalarWhereInput
    data: XOR<ExamAnswerUpdateManyMutationInput, ExamAnswerUncheckedUpdateManyWithoutExamAttemptInput>
  }

  export type ExamAttemptCreateWithoutAnswersInput = {
    id?: string
    totalScore: number
    totalQuestions: number
    timeTakenSecs: number
    topics?: ExamAttemptCreatetopicsInput | $Enums.Topic[]
    startedAt?: Date | string
    submittedAt?: Date | string
    user: UserCreateNestedOneWithoutExamAttemptsInput
  }

  export type ExamAttemptUncheckedCreateWithoutAnswersInput = {
    id?: string
    userId: string
    totalScore: number
    totalQuestions: number
    timeTakenSecs: number
    topics?: ExamAttemptCreatetopicsInput | $Enums.Topic[]
    startedAt?: Date | string
    submittedAt?: Date | string
  }

  export type ExamAttemptCreateOrConnectWithoutAnswersInput = {
    where: ExamAttemptWhereUniqueInput
    create: XOR<ExamAttemptCreateWithoutAnswersInput, ExamAttemptUncheckedCreateWithoutAnswersInput>
  }

  export type QuestionCreateWithoutExamAnswersInput = {
    id?: string
    content: string
    options: JsonNullValueInput | InputJsonValue
    answer: string
    explanation: string
    topic: $Enums.Topic
    difficulty: $Enums.Difficulty
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuestionUncheckedCreateWithoutExamAnswersInput = {
    id?: string
    content: string
    options: JsonNullValueInput | InputJsonValue
    answer: string
    explanation: string
    topic: $Enums.Topic
    difficulty: $Enums.Difficulty
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuestionCreateOrConnectWithoutExamAnswersInput = {
    where: QuestionWhereUniqueInput
    create: XOR<QuestionCreateWithoutExamAnswersInput, QuestionUncheckedCreateWithoutExamAnswersInput>
  }

  export type ExamAttemptUpsertWithoutAnswersInput = {
    update: XOR<ExamAttemptUpdateWithoutAnswersInput, ExamAttemptUncheckedUpdateWithoutAnswersInput>
    create: XOR<ExamAttemptCreateWithoutAnswersInput, ExamAttemptUncheckedCreateWithoutAnswersInput>
    where?: ExamAttemptWhereInput
  }

  export type ExamAttemptUpdateToOneWithWhereWithoutAnswersInput = {
    where?: ExamAttemptWhereInput
    data: XOR<ExamAttemptUpdateWithoutAnswersInput, ExamAttemptUncheckedUpdateWithoutAnswersInput>
  }

  export type ExamAttemptUpdateWithoutAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalScore?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    timeTakenSecs?: IntFieldUpdateOperationsInput | number
    topics?: ExamAttemptUpdatetopicsInput | $Enums.Topic[]
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutExamAttemptsNestedInput
  }

  export type ExamAttemptUncheckedUpdateWithoutAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    totalScore?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    timeTakenSecs?: IntFieldUpdateOperationsInput | number
    topics?: ExamAttemptUpdatetopicsInput | $Enums.Topic[]
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestionUpsertWithoutExamAnswersInput = {
    update: XOR<QuestionUpdateWithoutExamAnswersInput, QuestionUncheckedUpdateWithoutExamAnswersInput>
    create: XOR<QuestionCreateWithoutExamAnswersInput, QuestionUncheckedCreateWithoutExamAnswersInput>
    where?: QuestionWhereInput
  }

  export type QuestionUpdateToOneWithWhereWithoutExamAnswersInput = {
    where?: QuestionWhereInput
    data: XOR<QuestionUpdateWithoutExamAnswersInput, QuestionUncheckedUpdateWithoutExamAnswersInput>
  }

  export type QuestionUpdateWithoutExamAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    answer?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    topic?: EnumTopicFieldUpdateOperationsInput | $Enums.Topic
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestionUncheckedUpdateWithoutExamAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    answer?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    topic?: EnumTopicFieldUpdateOperationsInput | $Enums.Topic
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutChatSessionsInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    examAttempts?: ExamAttemptCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutChatSessionsInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    examAttempts?: ExamAttemptUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutChatSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutChatSessionsInput, UserUncheckedCreateWithoutChatSessionsInput>
  }

  export type ChatMessageCreateWithoutChatSessionInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    createdAt?: Date | string
  }

  export type ChatMessageUncheckedCreateWithoutChatSessionInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    createdAt?: Date | string
  }

  export type ChatMessageCreateOrConnectWithoutChatSessionInput = {
    where: ChatMessageWhereUniqueInput
    create: XOR<ChatMessageCreateWithoutChatSessionInput, ChatMessageUncheckedCreateWithoutChatSessionInput>
  }

  export type ChatMessageCreateManyChatSessionInputEnvelope = {
    data: ChatMessageCreateManyChatSessionInput | ChatMessageCreateManyChatSessionInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutChatSessionsInput = {
    update: XOR<UserUpdateWithoutChatSessionsInput, UserUncheckedUpdateWithoutChatSessionsInput>
    create: XOR<UserCreateWithoutChatSessionsInput, UserUncheckedCreateWithoutChatSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutChatSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutChatSessionsInput, UserUncheckedUpdateWithoutChatSessionsInput>
  }

  export type UserUpdateWithoutChatSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    examAttempts?: ExamAttemptUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutChatSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    examAttempts?: ExamAttemptUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChatMessageUpsertWithWhereUniqueWithoutChatSessionInput = {
    where: ChatMessageWhereUniqueInput
    update: XOR<ChatMessageUpdateWithoutChatSessionInput, ChatMessageUncheckedUpdateWithoutChatSessionInput>
    create: XOR<ChatMessageCreateWithoutChatSessionInput, ChatMessageUncheckedCreateWithoutChatSessionInput>
  }

  export type ChatMessageUpdateWithWhereUniqueWithoutChatSessionInput = {
    where: ChatMessageWhereUniqueInput
    data: XOR<ChatMessageUpdateWithoutChatSessionInput, ChatMessageUncheckedUpdateWithoutChatSessionInput>
  }

  export type ChatMessageUpdateManyWithWhereWithoutChatSessionInput = {
    where: ChatMessageScalarWhereInput
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyWithoutChatSessionInput>
  }

  export type ChatMessageScalarWhereInput = {
    AND?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    OR?: ChatMessageScalarWhereInput[]
    NOT?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    chatSessionId?: StringFilter<"ChatMessage"> | string
    role?: EnumMessageRoleFilter<"ChatMessage"> | $Enums.MessageRole
    content?: StringFilter<"ChatMessage"> | string
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
  }

  export type ChatSessionCreateWithoutMessagesInput = {
    id?: string
    title?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutChatSessionsInput
  }

  export type ChatSessionUncheckedCreateWithoutMessagesInput = {
    id?: string
    userId: string
    title?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChatSessionCreateOrConnectWithoutMessagesInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
  }

  export type ChatSessionUpsertWithoutMessagesInput = {
    update: XOR<ChatSessionUpdateWithoutMessagesInput, ChatSessionUncheckedUpdateWithoutMessagesInput>
    create: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
    where?: ChatSessionWhereInput
  }

  export type ChatSessionUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ChatSessionWhereInput
    data: XOR<ChatSessionUpdateWithoutMessagesInput, ChatSessionUncheckedUpdateWithoutMessagesInput>
  }

  export type ChatSessionUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutChatSessionsNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamAttemptCreateManyUserInput = {
    id?: string
    totalScore: number
    totalQuestions: number
    timeTakenSecs: number
    topics?: ExamAttemptCreatetopicsInput | $Enums.Topic[]
    startedAt?: Date | string
    submittedAt?: Date | string
  }

  export type ChatSessionCreateManyUserInput = {
    id?: string
    title?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExamAttemptUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalScore?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    timeTakenSecs?: IntFieldUpdateOperationsInput | number
    topics?: ExamAttemptUpdatetopicsInput | $Enums.Topic[]
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    answers?: ExamAnswerUpdateManyWithoutExamAttemptNestedInput
  }

  export type ExamAttemptUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalScore?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    timeTakenSecs?: IntFieldUpdateOperationsInput | number
    topics?: ExamAttemptUpdatetopicsInput | $Enums.Topic[]
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    answers?: ExamAnswerUncheckedUpdateManyWithoutExamAttemptNestedInput
  }

  export type ExamAttemptUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalScore?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    timeTakenSecs?: IntFieldUpdateOperationsInput | number
    topics?: ExamAttemptUpdatetopicsInput | $Enums.Topic[]
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUpdateManyWithoutChatSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUncheckedUpdateManyWithoutChatSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamAnswerCreateManyQuestionInput = {
    id?: string
    examAttemptId: string
    userAnswer?: string | null
    isCorrect: boolean
  }

  export type ExamAnswerUpdateWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    examAttempt?: ExamAttemptUpdateOneRequiredWithoutAnswersNestedInput
  }

  export type ExamAnswerUncheckedUpdateWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    examAttemptId?: StringFieldUpdateOperationsInput | string
    userAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ExamAnswerUncheckedUpdateManyWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    examAttemptId?: StringFieldUpdateOperationsInput | string
    userAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ExamAnswerCreateManyExamAttemptInput = {
    id?: string
    questionId: string
    userAnswer?: string | null
    isCorrect: boolean
  }

  export type ExamAnswerUpdateWithoutExamAttemptInput = {
    id?: StringFieldUpdateOperationsInput | string
    userAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    question?: QuestionUpdateOneRequiredWithoutExamAnswersNestedInput
  }

  export type ExamAnswerUncheckedUpdateWithoutExamAttemptInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    userAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ExamAnswerUncheckedUpdateManyWithoutExamAttemptInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    userAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ChatMessageCreateManyChatSessionInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    createdAt?: Date | string
  }

  export type ChatMessageUpdateWithoutChatSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateWithoutChatSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyWithoutChatSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}