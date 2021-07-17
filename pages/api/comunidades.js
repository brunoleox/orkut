import { SiteClient } from 'datocms-client'

const client = new SiteClient('0a73fafd12252cef5ad6e8fc960669')
export default async function recebedorDeRequest(req, res) {

    if (req.method === 'POST') {

        const TOKEN = '0a73fafd12252cef5ad6e8fc960669'
        const client = new SiteClient(TOKEN)

        await client.items.create({
            itemType: "968555", // ID Model Criado pelo Dato Automaticamente.
            ...req.body,
        })
    } return 
}