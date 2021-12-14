// Configs
import { kafkaJsInstrumentationConfig } from './kafkajs';
import { awsSdkInstrumentationConfig } from './aws-sdk';
import { typeormInstrumentationConfig, sequelizeInstrumentationConfig } from './orm';
import { ioredisInstrumentationConfig } from './ioredis';
import { httpInstrumentationConfig } from './http';
import { mongooseInstrumentationConfig } from './mongoose';
import { elasticsearchInstrumentationConfig } from './elasticsearch';
import { expressInstrumentationConfig } from './express';
import { neo4jInstrumentationConfig } from './neo4j';
import { amqplibInstrumentationConfig } from './amqplib';

// Instrumentations
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';
import { ExpressInstrumentation } from 'opentelemetry-instrumentation-express';
import { SequelizeInstrumentation } from 'opentelemetry-instrumentation-sequelize';
import { AwsInstrumentation } from '@opentelemetry/instrumentation-aws-sdk';
import { TypeormInstrumentation } from 'opentelemetry-instrumentation-typeorm';
import { KafkaJsInstrumentation } from 'opentelemetry-instrumentation-kafkajs';
import { MongooseInstrumentation } from 'opentelemetry-instrumentation-mongoose';
import { ElasticsearchInstrumentation } from 'opentelemetry-instrumentation-elasticsearch';
import { Neo4jInstrumentation } from 'opentelemetry-instrumentation-neo4j';
import { AmqplibInstrumentation } from 'opentelemetry-instrumentation-amqplib';
import { AutoInstrumentationOptions } from '../types';
import { InstrumentationOption } from '@opentelemetry/instrumentation';

const DEFAULT_OPTIONS: AutoInstrumentationOptions = {
    collectPayloads: false,
    suppressInternalInstrumentation: true,
};

export const getNodeAutoInstrumentations = (options?: AutoInstrumentationOptions): InstrumentationOption[] => {
    const optionsWithDefaults = { ...DEFAULT_OPTIONS, ...options };
    return [
        new ExpressInstrumentation(expressInstrumentationConfig(optionsWithDefaults)),
        new SequelizeInstrumentation(sequelizeInstrumentationConfig(optionsWithDefaults)),
        new KafkaJsInstrumentation(kafkaJsInstrumentationConfig(optionsWithDefaults)),
        new AwsInstrumentation(awsSdkInstrumentationConfig(optionsWithDefaults)),
        new TypeormInstrumentation(typeormInstrumentationConfig(optionsWithDefaults)),
        new MongooseInstrumentation(mongooseInstrumentationConfig(optionsWithDefaults)),
        new ElasticsearchInstrumentation(elasticsearchInstrumentationConfig(optionsWithDefaults)),
        new HttpInstrumentation(httpInstrumentationConfig(optionsWithDefaults)),
        new Neo4jInstrumentation(neo4jInstrumentationConfig(optionsWithDefaults)),
        new AmqplibInstrumentation(amqplibInstrumentationConfig(optionsWithDefaults)),
        new IORedisInstrumentation(ioredisInstrumentationConfig(optionsWithDefaults)),
    ];
};
