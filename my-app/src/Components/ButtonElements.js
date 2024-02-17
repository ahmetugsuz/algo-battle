import { MdInfo } from 'react-icons/md';
import { MdArrowLeft, MdArrowRight } from 'react-icons/md';
import {HiOutlineRefresh} from 'react-icons/hi';
import {RiArrowRightLine} from 'react-icons/ri';
import { AiOutlineClose } from "react-icons/ai";
import styled from 'styled-components';

export const InfoBtn = styled(MdInfo)`
    margin-top: -6px;
    font-size: 40px;
    border-radius: 1000px;
    cursor: pointer;

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

export const NextPageArrow = styled(RiArrowRightLine)`
    position: absolute;
    margin-top: 2px;
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
