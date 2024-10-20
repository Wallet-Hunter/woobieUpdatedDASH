import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useNavigate } from 'react-router-dom';



const Item = ({ title, to, icon, selected, setSelected,disabled, onClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const handleClick = () => {
    if (onClick) {
      onClick(); // Call the custom click handler if provided
    } else {
      setSelected(title);
    }
  };
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: disabled ? colors.grey[500] : colors.grey[100], // Lighter color for disabled
        cursor: disabled ? "not-allowed" : "pointer", // Change cursor for disabled
        ...(disabled ? {} : { // Apply hover effect only if not disabled
          '&:hover': {
            color: "#54d5d9",
            borderTop: `1px solid ${colors.green[500]}`,  // Top border
            borderBottom: `1px solid ${colors.green[500]}`,  // Bottom border
            borderLeft: "none",
          },
        })
      }}
      onClick={handleClick}  // Only update if not disabled
      icon={icon}
      disabled={disabled} // Disable click
    >
     <Typography>{title}</Typography>
     {!disabled && <Link to={to} />}
    </MenuItem>
  );
};

const Sidebar = ({isCollapsed, setIsCollapsed, authToken }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();
  //function to redirect to login for community management 
  const handleCommunityManagementClick = () => {
    const botUsername = "LoginTtbot";
    const url = `tg://resolve?domain=${botUsername}&start=${authToken}`;
    if(authToken) {
      let anchor = document.createElement("a");
      anchor.href = url;
      anchor.target = "_blank";
      anchor.click();
      anchor.remove();
    }else {
      navigate('/communitymanagement');
    }
  }

  return (
    <Box
      sx={{
        position: "fixed", 
        top: 0,
        left: 0,
        paddingTop: "50px",
        height: "100vh", 
        width: isCollapsed ? "80px" : "250px", 
        overflow: "auto", 
        backgroundColor: "transparent", 
        borderRight: `2px solid ${colors.grey[500]}`,
        "& .pro-sidebar-inner": {
          background: "transparent !important", 
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#54d5d9 !important",
          borderTop: `1px solid ${colors.green[500]}`,  // Top border
          borderBottom: `1px solid ${colors.green[500]}`,  // Bottom border
          borderLeft: "none !important",  // No left border
        },
        "& .pro-menu-item.active": {
          color: "#54d5d9 !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)} 
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
             <Box
             display="flex"
             justifyContent="space-between"
             alignItems="center"
             ml="15px"
           >
             <Box textAlign="center">
             <Typography
               variant="h2"
               color={colors.grey[100]}
               fontWeight="bold"
               sx={{ m: "10px 0 0 0" }}
             >
               WooBee
             </Typography>
           </Box>
             <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
               <MenuOutlinedIcon />
             </IconButton>
           </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="160px"
                  height="160px"
                  src={process.env.PUBLIC_URL +`/assets/newlogo.png`}
                  
                  style={{ cursor: "pointer" }}
                />
              </Box>
              
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Community Management"
              to="#"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              onClick={handleCommunityManagementClick}
            />
            <Item
              title="Lead Generation"
              to="/contacts"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={false}
              disabled={true}  // Temporarily unclickable, no hover
            />
            <Item
              title="Telegram Ads"
              to="/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={false}
              setSelected={false}
              disabled={true}  // Temporarily unclickable, no hover
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Profile"
              to="/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
