import Image from 'react-bootstrap/image'

//convert url to <a>, image url to <Image src=value>
export const convertValueToComponent = (value) => {
    const type = typeof value;
    // console.log('checkType', type);

    //value is string
    if (type === 'string') {
        //value is url
        if (isValidHttpUrl(value)) {
            //value is image url
            if (value.match(/\.(jpeg|jpg|gif|png)$/) != null) {
                return <Image src={value} fluid />
            }
            return <a href={value}>{value}</a>
        }
    }
    //boolean
    else if (type === 'boolean') {
        return value.toString();
    }
    
    return value;
}


const isValidHttpUrl = (string) => {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}
