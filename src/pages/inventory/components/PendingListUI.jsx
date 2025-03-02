
import React from "react";
import {Paper,List,ListItem,ListItemText,IconButton,Button,Stack} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";


const PendingListUI = React.memo(({ pendingList, handleDeleteMaterial, hasDuplicates }) => {

    console.log('PendingListUI Rendered');

    return(
        <Paper sx={{ p: 2,width: "100%", maxHeight: "350px", overflow: "auto" }}>
            <List>
                {pendingList.length === 0 ? (
                    <ListItem>
                        <ListItemText primary="尚未加入任何材料" />
                    </ListItem>
                ):(
                    pendingList.map((item,index)=>(
                        <ListItem key={index}>
                            <ListItemText
                                primary={`${item.uniqueID} - ${item.name}`}
                                secondary={`${item.mainCategory} | ${item.unit}`}
                            />
                            <IconButton edge="end" onClick={() => handleDeleteMaterial(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    )
                    )
                )}
                <Stack>
                    <Button onClick={hasDuplicates}>Verify DATA</Button> 
                </Stack>
            </List>
        </Paper>
    )
})

export default PendingListUI;