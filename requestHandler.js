export const requestStatusHandler = (responseData) => {
    let status = responseData.result[0].importStatus

    return status
}