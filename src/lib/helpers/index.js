
export const formatData=(data)=>{
    let formatted=[];
    data?.forEach(({id,username})=>{
        formatted.push({
            label:username,
            value:id
        })
    })
    formatted.push({label:"None",value:"none"})
    
    return formatted
}

export const getUserNameFromId=(users,ID)=>{
   return users.find(({id})=>id==ID)?.username??"Verified By"
}