export function countMaxVotes(total, values){
    const percentMap = {};
    values.forEach((value, index)=>{
        const p = Math.round(value/total * 100);
        percentMap[index+1] = p;
    })

    let max = 0;
    let voteIndex = null;

    for(let vote in percentMap){
        if(percentMap[vote] > max){
            max = percentMap[vote];
            voteIndex = vote;
        }
    }

    return {
        value: max,
        vote: voteIndex
    }

}