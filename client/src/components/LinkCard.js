export const LinkCard = ({link}) => {
    return (
        <div>
            <h2>
                Link
            </h2>
            <p>Cut: <a href={link.to} target="_blank" rel="noopener noreferrer">{link.to}</a></p>
            <p>From: <a href={link.from} target="_blank" rel="noopener noreferrer">{link.from}</a></p>
            <p>Clicks: <strong> {link.clicks}</strong></p>
            <p>Creating date: <data>{ new Date(link.date).toLocaleDateString()}</data></p>
        </div>
    )
}