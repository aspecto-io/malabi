export interface AutoInstrumentationOptions {
    /**
     * Collect operations payloads (request and response) when possible.
     * Setting this option to true increases observability with the cost of more resources (memory, cpu, network)
     *
     * Default: false
     * */
    collectPayloads?: boolean;

    /**
     * Don't collect spans for internal implementation operations of instrumented packages.
     * For example, aws-sdk is using http under the hood, which can be noisy for the user which already has the data in higher level.
     * Internal implementation spans are sometimes interesting, but mostly don't.
     *
     * Setting this option to false will uncover more of what your application is actually doing in low level implementation,
     * with the cost of larger traces and more resources (memory, cpu, network),
     *
     * Default: true
     */
    suppressInternalInstrumentation?: boolean;
}
