import { MdInfo } from 'react-icons/md';
import { MdArrowLeft, MdArrowRight } from 'react-icons/md';
import {HiOutlineRefresh} from 'react-icons/hi';
import {RiArrowRightLine} from 'react-icons/ri';
import { AiOutlineClose } from "react-icons/ai";
import { TbHomeMove } from "react-icons/tb";
import { BsInfoCircle } from "react-icons/bs";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { TbInfoCircle } from "react-icons/tb";
import { BsFillChatSquareFill } from "react-icons/bs";
import { IoChatboxSharp } from "react-icons/io5";
import styled from 'styled-components';


export const ChatBuble = styled(BsFillChatSquareFill)`
    width: 390px;
    height: 230px;
    z-index: 1;
    display: end;
    text-align: bottom;
    justify-content: bottom;
    color: rgb(255, 255, 255);
    color: white; /* Set icon color to white */
    fill: currentColor;
    position: relative;
    justify-content: center;
    text-align: center;
    margin: auto;


    @media screen and (max-width: 1600px){
        height: 190px;

    }
    
`;

export const ChatBuble2 = styled(IoChatboxSharp)`
    width: 400px;
    height: 200px;
    z-index: 1;
    display: end;
    text-align: bottom;
    justify-content: bottom;
    color: rgb(255, 255, 255);
    color: white; /* Set icon color to white */
    fill: currentColor;
    position: relative;
    justify-content: center;
    text-align: center;
    margin: auto;
    margin-left: 100px;


    @media screen and (max-width: 1600px){
        height: 200px;

    }
`;

export const InfoBtn = styled(TbInfoCircle)`
    margin-top: -4px;
    font-size: 35px;
    border-radius: 1000px;
    cursor: pointer;
    position: absolute;
    right: 0;
    color: #111;
`;


export const RestartBtn = styled(TbHomeMove)`
    margin-top: -5px;
    font-size: 33px;
    border-radius: 1000px;
    cursor: pointer;
    position: absolute;
    right: 0;
    color: #111;
`;

export const LeftArrow = styled(MdArrowLeft)`
    color: black;
    position: absolute;
    bottom: 0;
    left: 0;
    margin-left: -5px;
    margin-bottom: 2px;
`

export const RightArrow = styled(MdArrowRight)`
    color: black;
    position: absolute;
    bottom: 0;
    left: 0;
    margin-left: -5px;
    margin-bottom: 2px;
`

export const RightArrowBattleSection = styled(RiArrowRightLine)`
    postion: absolute;
    padding: 0;
    marging: auto;
    right: 0;
    margin-top: 1px;
    margin-left: 3px;
    color: #222;
`;

export const NextPageArrow = styled(RiArrowRightLine)`
    position: absolute;
    margin-top: 2px;
`;

export const RightSideArrow = styled(RiArrowRightLine)`
    width: 25px;  // Set width for horizontal size
    height: 25px; // Set height for vertical size
    margin-left: -20px;
    padding-right:14px;
    color: #555;
`;

export const RefreshArrows = styled(HiOutlineRefresh)`
    transition: transform 0.5s ease;
    cursor: pointer;
    font-size: 2rem;
    margin: auto;
    margin-left: 20px;
    &:hover{
        transform: rotate(180deg);
    }
`;


export const CloseIcon = styled(AiOutlineClose)`
    font-size: 2rem;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;


`;
