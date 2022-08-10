import { isUri } from 'valid-url';
import { filterImageFromURL, deleteLocalFiles } from '../../../../util/util';
import { Router, Request, Response } from 'express';

const router: Router = Router();

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    const imageUrl = req.query.image_url
    //if no url, wrong url or without images, return 400
    if (!imageUrl && !isUri(imageUrl))
        return res.status(400).send({ success: false, message: 'Unexistent or badly formatted URL' })

    let image_path: string = null;

    try {
        image_path = await filterImageFromURL(imageUrl)
    } catch (error: any) {
        return res.send({ success: false, message: error.message })
    }

    if (!image_path)
        return res.status(500).send({ success: false, message: 'Something went wrong' })

    res.status(200).sendFile(image_path, err =>{
        if(err) return res.status(500).send({ success: false, message: 'Something went wrong' }) 
        //delete after sending
        deleteLocalFiles([image_path])
    })
});

export const FilteredImageRouter: Router = router;