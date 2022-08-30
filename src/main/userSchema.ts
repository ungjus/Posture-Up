export type SchemaType = {
    switchOff: boolean,
    minutes: number,
    streakCounter: {
        yes: number,
        no: number
    },
    postureCounter: {
        yes: number,
        total: number
    }
}

export const schema = {
    defaults: {
        switchOff: true,
        minutes: 30,
        streakCounter: {
            yes: 0,
            no: 0
        },
        postureCounter: {
            yes: 0,
            total: 0
        }
    }
};