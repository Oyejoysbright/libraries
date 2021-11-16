import { baseUrl } from '../../services/Constant'
import HttpFactory from '../utils/HttpFactory'
import { JFile } from '../utils/Jpc';

function DownloadButton({url, ext = JFile.getFileExt(url), className, style={}, label = "Download", title}) {
    const handleClick = () => {
        HttpFactory.syncDownloadData(`${baseUrl}/download?file=${url}`, undefined, (data) => {
            JFile.download(<a></a>, data, ext);
        })
    }
    return (
        <div title={title} onClick={handleClick} style={{...styles.container, ...style}} className={className}>
            {label}
        </div>
    )
}

export default DownloadButton

const styles = {
    container: {
        padding: '10px 15px',
        margin: '5px',
        color: 'blue',
        cursor: 'pointer'
    }
}