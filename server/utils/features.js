import {v4 as uuid} from 'uuid'

function generateString(len){
    return Math.random().toString(36).substring(2,2+len).toUpperCase()
}

const generateAccountId = ()=>{
    const year = new Date().getFullYear()
    const part1 = generateString(6)
    const part2 = generateString(6)
    return `ACC-${year}-${part1}-${part2}`
}

const generateToken=()=>{
    return uuid()
}

export {
    generateAccountId,
    generateToken
}