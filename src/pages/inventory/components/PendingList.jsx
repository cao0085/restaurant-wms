

import {Paper,List,ListItem,ListItemText,ListItemSecondaryAction,IconButton,Button,Stack} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";






export default function PendingList({pendingList,handleDeleteMaterial,hasDuplicates}) {


    
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
}