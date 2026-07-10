const pool = require ('../db');

const createListing = async (req, res) => {
    const {title , listing_type, description, location, price} = req.body;

    if(!title || !listing_type || !description || !location || !price){
        return res.status(400).json({error: "All fields are required"});
    }
    if(price <= 0){
        return res.status(400).json({error:"Price cannot be less than $0"})
    }


    try{
        const validTypes = ['room_available', 'looking_for_room', 'looking_for_roommate'];
        if(!validTypes.includes(listing_type)){
            return res.status(400).json({error: "invalid listing type!"})
        }
        const newlisting = await pool.query(
            'INSERT INTO listings( user_id, title, listing_type, description, location, price ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [req.user.id, title, listing_type, description, location, price] 
        );
        res.status(201).json({
            message:"Listing created successfully!",
            listing: newlisting.rows[0]
        });

    }
    catch(error){
        console.error(error);
        res.status(500).json({error: 'Server error'});
    }

};

const getAllListings = async (req,res) => {
    try{
        const listings = await pool.query(
            ('SELECT * FROM listings WHERE is_active = true ORDER BY created_at DESC')
        )
        res.status(200).json({listings: listings.rows});

    }catch(error){
        console.error(error);
        res.status(500).json({error:"Server error"});
    }
}

const getOneListing = async (req, res) =>{
    const {id} = req.params;
    try{
        const listing = await pool.query(
            "SELECT * FROM listings WHERE id = $1", [id]
        );
        if(listing.rows.length === 0){
            return res.status(404).json({error:'listing not found'});
        }
        res.status(200).json({listings: listing.rows[0]});
    }catch(error){
        console.error(error)
        res.status(500).json({error:'Server error'})
    }
}

const updateListing = async (req, res) => {
    const { id } = req.params;
    const{title, listing_type, description, location, price, is_active} = req.body;
    try{
        const listing = await pool.query(
            'SELECT * FROM listings WHERE id = $1',[id]
        )
        if(listing.rows.length === 0){
            return res.status(404).json({error:'Listing not found'});
        }
        if(listing.rows[0].user_id != req.user.id){
            return res.status(403).json({error:'Unauthorized'});
        }
        const updated = await pool.query(
            'UPDATE listings SET title = $1, listing_type= $2, description = $3, location = $4, price = $5, is_active = $6 WHERE id = $7 RETURNING *',
            [title, listing_type, description, location, price, is_active, id]
        );
        res.status(200).json({listing:updated.rows[0]});
    }catch(error){
        console.error(error)
        res.status(500).json({error:'Server error'})
    }
}

const deleteListing = async (req,res) => {
    const { id } = req.params;
    try{
        const listing = await pool.query(
            'SELECT * FROM listings WHERE id = $1',
            [id]
        )
        if (listing.rows.length === 0){
            return res.status(404).json({error:'listing not found'});
        }
        if (listing.rows[0].user_id !== req.user.id){
            return res.status(403).json({error:'Unauthorized'});
        }
        await pool.query (
            'DELETE FROM listings WHERE id = $1',
            [id]
        )
        res.status(200).json({message:"Listing deleted successfully"});

    }
    catch(error){
        console.error(error);
        res.status(500).json({error:'Server error'});
    }
}


module.exports = {createListing, getAllListings, getOneListing, updateListing, deleteListing};