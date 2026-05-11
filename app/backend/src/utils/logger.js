import morgan from "morgan"

morgan.token("ist-date", () => {
    return new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false,
    })
})

morgan.token("colored-status", (req, res) => {
    const status = res.statusCode

    if (status >= 500) return `\x1b[31m${status}\x1b[0m`
    if (status >= 400) return `\x1b[33m${status}\x1b[0m`
    if (status >= 300) return `\x1b[36m${status}\x1b[0m`

    return `\x1b[32m${status}\x1b[0m`
})

const format =
    "[:ist-date] :method :url :colored-status :response-time ms"

const logger = morgan(format)

export default logger