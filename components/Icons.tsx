type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  dashboard: (props: IconProps) => (
    <svg
      width="20"
      id="icon"
      height="21"
      viewBox="0 0 20 21"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="currentColor"
        d="M2.5 7.05257V17.0526C2.5 17.2736 2.5878 17.4855 2.74408 17.6418C2.90036 17.7981 3.11232 17.8859 3.33333 17.8859H7.5C7.72101 17.8859 7.93297 17.7981 8.08925 17.6418C8.24554 17.4855 8.33333 17.2736 8.33333 17.0526V11.2192H11.6667V17.0526C11.6667 17.2736 11.7545 17.4855 11.9107 17.6418C12.067 17.7981 12.279 17.8859 12.5 17.8859H16.6667C16.8877 17.8859 17.0996 17.7981 17.2559 17.6418C17.4122 17.4855 17.5 17.2736 17.5 17.0526V7.05257C17.5 6.9232 17.4699 6.79561 17.412 6.67989C17.3542 6.56418 17.2702 6.46353 17.1667 6.38591L10.5 1.38591C10.3558 1.27772 10.1803 1.21924 10 1.21924C9.81969 1.21924 9.64425 1.27772 9.5 1.38591L2.83333 6.38591C2.72984 6.46353 2.64583 6.56418 2.58798 6.67989C2.53012 6.79561 2.5 6.9232 2.5 7.05257ZM4.16667 7.46924L10 3.09424L15.8333 7.46924V16.2192H13.3333V10.3859C13.3333 10.1649 13.2455 9.95293 13.0893 9.79665C12.933 9.64037 12.721 9.55257 12.5 9.55257H7.5C7.27899 9.55257 7.06702 9.64037 6.91074 9.79665C6.75446 9.95293 6.66667 10.1649 6.66667 10.3859V16.2192H4.16667V7.46924Z"
      />
    </svg>
  ),
  menu: (props: IconProps) => (
    <svg
      width="20"
      id="icon"
      height="21"
      viewBox="0 0 20 21"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="fill-current"
        d="M17.5002 4.55277H2.5002C2.02798 4.55277 1.66687 4.19166 1.66687 3.71944C1.66687 3.24722 2.02798 2.88611 2.5002 2.88611H17.5002C17.9724 2.88611 18.3335 3.24722 18.3335 3.71944C18.3335 4.19166 17.9724 4.55277 17.5002 4.55277Z"
      />
      <path
        className="fill-current"
        d="M12.5002 8.99717H2.5002C2.02798 8.99717 1.66687 8.63606 1.66687 8.16384C1.66687 7.69162 2.02798 7.33051 2.5002 7.33051H12.5002C12.9724 7.33051 13.3335 7.69162 13.3335 8.16384C13.3335 8.63606 12.9724 8.99717 12.5002 8.99717Z"
      />
      <path
        className="fill-current"
        d="M17.5002 13.4416H2.5002C2.02798 13.4416 1.66687 13.0805 1.66687 12.6083C1.66687 12.1361 2.02798 11.775 2.5002 11.775H17.5002C17.9724 11.775 18.3335 12.1361 18.3335 12.6083C18.3335 13.0805 17.9724 13.4416 17.5002 13.4416Z"
      />
      <path
        className="fill-current"
        d="M12.5002 17.886H2.5002C2.02798 17.886 1.66687 17.5249 1.66687 17.0527C1.66687 16.5805 2.02798 16.2194 2.5002 16.2194H12.5002C12.9724 16.2194 13.3335 16.5805 13.3335 17.0527C13.3335 17.5249 12.9724 17.886 12.5002 17.886Z"
      />
    </svg>
  ),
  voucher: (props: IconProps) => (
    <svg
      width="20"
      id="icon"
      height="21"
      viewBox="0 0 20 21"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="fill-current"
        d="M10.5417 2.25273C10.3908 2.12365 10.1987 2.05272 10 2.05273H4.16671C3.94569 2.05273 3.73373 2.14053 3.57745 2.29681C3.42117 2.45309 3.33337 2.66505 3.33337 2.88607V17.8861C3.33337 18.1071 3.42117 18.319 3.57745 18.4753C3.73373 18.6316 3.94569 18.7194 4.16671 18.7194H15.8334C16.0544 18.7194 16.2664 18.6316 16.4226 18.4753C16.5789 18.319 16.6667 18.1071 16.6667 17.8861V7.88607C16.6667 7.7657 16.6406 7.64676 16.5903 7.53743C16.5399 7.4281 16.4665 7.33097 16.375 7.25273L10.5417 2.25273ZM10.8334 4.6944L13.5834 7.05273H10.8334V4.6944ZM15 17.0527H5.00004V3.7194H9.16671V7.88607C9.16671 8.10708 9.25451 8.31904 9.41079 8.47532C9.56707 8.6316 9.77903 8.7194 10 8.7194H15V17.0527Z"
      />
    </svg>
  ),
  customer: (props: IconProps) => (
    <svg
      width="20"
      id="icon"
      height="21"
      viewBox="0 0 20 21"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="fill-current"
        d="M15.9916 14.3111C16.4243 13.7946 16.6631 13.1432 16.6666 12.4694C16.6666 11.6959 16.3593 10.954 15.8124 10.407C15.2654 9.86007 14.5235 9.55278 13.75 9.55278H13.5166C14.2039 8.7361 14.5815 7.70347 14.5833 6.63611C14.5852 5.86657 14.3934 5.10892 14.0254 4.43304C13.6575 3.75717 13.1253 3.18481 12.4779 2.76877C11.8305 2.35273 11.0888 2.10639 10.3211 2.05247C9.55347 1.99854 8.7846 2.13878 8.08541 2.46023C7.38622 2.78169 6.77922 3.27402 6.3204 3.89183C5.86158 4.50963 5.56569 5.23302 5.46004 5.99528C5.35439 6.75753 5.44237 7.53413 5.71586 8.25343C5.98935 8.97274 6.43956 9.6116 7.02496 10.1111C5.45018 10.713 4.09498 11.7783 3.13831 13.1664C2.18164 14.5546 1.66849 16.2002 1.66663 17.8861C1.66663 18.1071 1.75442 18.3191 1.9107 18.4754C2.06698 18.6316 2.27895 18.7194 2.49996 18.7194C2.72097 18.7194 2.93293 18.6316 3.08922 18.4754C3.2455 18.3191 3.33329 18.1071 3.33329 17.8861C3.33329 16.118 4.03567 14.4223 5.28591 13.1721C6.53616 11.9218 8.23185 11.2194 9.99996 11.2194H11.125C10.8809 11.7161 10.7871 12.2733 10.8552 12.8225C10.9233 13.3717 11.1503 13.8891 11.5083 14.3111C10.7984 14.7082 10.2071 15.2874 9.79553 15.989C9.38393 16.6906 9.16684 17.4893 9.16663 18.3028C9.16663 18.5238 9.25442 18.7358 9.4107 18.892C9.56698 19.0483 9.77895 19.1361 9.99996 19.1361C10.221 19.1361 10.4329 19.0483 10.5892 18.892C10.7455 18.7358 10.8333 18.5238 10.8333 18.3028C10.8333 17.5292 11.1406 16.7874 11.6876 16.2404C12.2345 15.6934 12.9764 15.3861 13.75 15.3861C14.5235 15.3861 15.2654 15.6934 15.8124 16.2404C16.3593 16.7874 16.6666 17.5292 16.6666 18.3028C16.6666 18.5238 16.7544 18.7358 16.9107 18.892C17.067 19.0483 17.2789 19.1361 17.5 19.1361C17.721 19.1361 17.9329 19.0483 18.0892 18.892C18.2455 18.7358 18.3333 18.5238 18.3333 18.3028C18.3331 17.4893 18.116 16.6906 17.7044 15.989C17.2928 15.2874 16.7016 14.7082 15.9916 14.3111V14.3111ZM9.99996 9.55278C9.4231 9.55278 8.85919 9.38172 8.37955 9.06123C7.8999 8.74074 7.52607 8.28522 7.30531 7.75227C7.08456 7.21932 7.0268 6.63288 7.13934 6.0671C7.25188 5.50132 7.52966 4.98162 7.93756 4.57372C8.34547 4.16581 8.86517 3.88803 9.43095 3.77549C9.99672 3.66295 10.5832 3.72071 11.1161 3.94146C11.6491 4.16222 12.1046 4.53606 12.4251 5.0157C12.7456 5.49534 12.9166 6.05925 12.9166 6.63611C12.9166 7.40966 12.6093 8.15152 12.0624 8.69851C11.5154 9.24549 10.7735 9.55278 9.99996 9.55278V9.55278ZM13.75 13.7194C13.4184 13.7194 13.1005 13.5877 12.8661 13.3533C12.6317 13.1189 12.5 12.801 12.5 12.4694C12.5021 12.1386 12.6345 11.8219 12.8685 11.588C13.1024 11.354 13.4191 11.2216 13.75 11.2194C14.0815 11.2194 14.3994 11.3511 14.6338 11.5856C14.8683 11.82 15 12.1379 15 12.4694C15 12.801 14.8683 13.1189 14.6338 13.3533C14.3994 13.5877 14.0815 13.7194 13.75 13.7194Z"
      />
    </svg>
  ),
  order: (props: IconProps) => (
    <svg
      width="20"
      id="icon"
      height="21"
      viewBox="0 0 20 21"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="fill-current"
        d="M16.875 7.26111H16.0032L16.1094 6.1973C16.1354 5.93666 16.1066 5.67347 16.0246 5.42469C15.9427 5.1759 15.8096 4.94704 15.6338 4.75285C15.458 4.55866 15.2435 4.40345 15.0041 4.29722C14.7647 4.191 14.5057 4.13611 14.2437 4.13611H4.50625C4.24427 4.13613 3.9852 4.19104 3.74573 4.2973C3.50627 4.40357 3.29173 4.55882 3.11594 4.75307C2.94015 4.94731 2.80701 5.17624 2.7251 5.42508C2.64319 5.67393 2.61433 5.93718 2.64037 6.19786L3.4963 15.758C3.51309 15.9079 3.48018 15.5969 3.59993 16.1968H1.73055C1.56479 16.1968 1.40582 16.2626 1.28861 16.3798C1.1714 16.4971 1.10555 16.656 1.10555 16.8218C1.10555 16.9875 1.1714 17.1465 1.28861 17.2637C1.40582 17.3809 1.56479 17.4468 1.73055 17.4468L17 17.6361C17.1658 17.6361 17.3247 17.5703 17.4419 17.4531C17.5591 17.3358 17.625 17.1769 17.625 17.0111C17.625 16.8453 17.5591 16.6864 17.4419 16.5692C17.3247 16.452 17.1658 16.3861 17 16.3861H15.1307C15.1827 16.2447 15.2175 16.0976 15.2342 15.9479L15.4405 12.8861H16.875C17.3721 12.8856 17.8487 12.6878 18.2002 12.3363C18.5517 11.9848 18.7495 11.5082 18.75 11.0111V9.13611C18.7495 8.639 18.5517 8.1624 18.2002 7.81089C17.8487 7.45937 17.3721 7.26165 16.875 7.26111ZM5.66128 16.1968C5.50625 16.1973 5.3566 16.1399 5.24167 16.0359C5.12673 15.9318 5.05478 15.7886 5.03991 15.6343L4.13784 6.22593C4.12913 6.139 4.13874 6.05121 4.16603 5.96821C4.19332 5.88521 4.23769 5.80886 4.29629 5.74405C4.35489 5.67925 4.42641 5.62744 4.50625 5.59196C4.58608 5.55648 4.67247 5.53812 4.75984 5.53805L14.0204 5.59196C14.1077 5.59202 14.1941 5.61037 14.2739 5.64582C14.3537 5.68127 14.4252 5.73305 14.4838 5.79781C14.5424 5.86258 14.5868 5.93889 14.6141 6.02185C14.6414 6.1048 14.6511 6.19256 14.6424 6.27946L14.0204 15.6349C14.0054 15.7892 13.9334 15.9323 13.8184 16.0362C13.7034 16.1401 13.5538 16.1974 13.3988 16.1968H5.66128ZM17.5 11.0111C17.4999 11.1768 17.434 11.3358 17.3168 11.4529C17.1996 11.5701 17.0407 11.636 16.875 11.6361H15.5656L15.8781 8.51111H16.875C17.0407 8.51121 17.1996 8.57709 17.3168 8.69428C17.434 8.81147 17.4999 8.97038 17.5 9.13611V11.0111Z"
      />
    </svg>
  ),
  employee: (props: IconProps) => (
    <svg
      width="20"
      id="icon"
      height="21"
      viewBox="0 0 20 21"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="fill-current"
        d="M12.975 10.1109C13.688 9.50251 14.1974 8.69007 14.4344 7.78316C14.6714 6.87626 14.6246 5.91849 14.3004 5.03899C13.9761 4.15949 13.39 3.40055 12.6211 2.86448C11.8521 2.32842 10.9373 2.04102 9.99996 2.04102C9.0626 2.04102 8.14777 2.32842 7.37882 2.86448C6.60987 3.40055 6.02377 4.15949 5.69954 5.03899C5.37531 5.91849 5.32854 6.87626 5.56554 7.78316C5.80253 8.69007 6.3119 9.50251 7.02496 10.1109C5.45018 10.7128 4.09498 11.7781 3.13831 13.1663C2.18164 14.5544 1.66849 16.2001 1.66663 17.8859C1.66663 18.107 1.75442 18.3189 1.9107 18.4752C2.06698 18.6315 2.27895 18.7193 2.49996 18.7193C2.72097 18.7193 2.93293 18.6315 3.08922 18.4752C3.2455 18.3189 3.33329 18.107 3.33329 17.8859C3.33329 16.1178 4.03567 14.4221 5.28591 13.1719C6.53616 11.9217 8.23185 11.2193 9.99996 11.2193C11.7681 11.2193 13.4638 11.9217 14.714 13.1719C15.9642 14.4221 16.6666 16.1178 16.6666 17.8859C16.6666 18.107 16.7544 18.3189 16.9107 18.4752C17.067 18.6315 17.2789 18.7193 17.5 18.7193C17.721 18.7193 17.9329 18.6315 18.0892 18.4752C18.2455 18.3189 18.3333 18.107 18.3333 17.8859C18.3314 16.2001 17.8183 14.5544 16.8616 13.1663C15.9049 11.7781 14.5497 10.7128 12.975 10.1109ZM9.99996 9.55261C9.4231 9.55261 8.85919 9.38155 8.37955 9.06106C7.8999 8.74057 7.52607 8.28505 7.30531 7.7521C7.08456 7.21915 7.0268 6.63271 7.13934 6.06693C7.25188 5.50115 7.52966 4.98145 7.93757 4.57355C8.34547 4.16564 8.86517 3.88786 9.43095 3.77532C9.99673 3.66278 10.5832 3.72054 11.1161 3.94129C11.6491 4.16205 12.1046 4.53588 12.4251 5.01553C12.7456 5.49517 12.9166 6.05908 12.9166 6.63594C12.9166 7.40949 12.6093 8.15135 12.0624 8.69834C11.5154 9.24532 10.7735 9.55261 9.99996 9.55261Z"
      />
    </svg>
  ),
  analytics: (props: IconProps) => (
    <svg
      width="20"
      id="icon"
      height="21"
      viewBox="0 0 20 21"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="fill-current"
        d="M17.5 16.2194H4.16667V2.8861C4.16667 2.66508 4.07887 2.45312 3.92259 2.29684C3.76631 2.14056 3.55435 2.05276 3.33333 2.05276C3.11232 2.05276 2.90036 2.14056 2.74408 2.29684C2.5878 2.45312 2.5 2.66508 2.5 2.8861V17.0528C2.5 17.2738 2.5878 17.4857 2.74408 17.642C2.90036 17.7983 3.11232 17.8861 3.33333 17.8861H17.5C17.721 17.8861 17.933 17.7983 18.0893 17.642C18.2455 17.4857 18.3333 17.2738 18.3333 17.0528C18.3333 16.8318 18.2455 16.6198 18.0893 16.4635C17.933 16.3072 17.721 16.2194 17.5 16.2194Z"
      />
      <path
        className="fill-current"
        d="M5.83337 9.55278V13.7194C5.83337 13.9405 5.92117 14.1524 6.07745 14.3087C6.23373 14.465 6.44569 14.5528 6.66671 14.5528C6.88772 14.5528 7.09968 14.465 7.25596 14.3087C7.41224 14.1524 7.50004 13.9405 7.50004 13.7194V9.55278C7.50004 9.33177 7.41224 9.11981 7.25596 8.96353C7.09968 8.80725 6.88772 8.71945 6.66671 8.71945C6.44569 8.71945 6.23373 8.80725 6.07745 8.96353C5.92117 9.11981 5.83337 9.33177 5.83337 9.55278Z"
      />
      <path
        className="fill-current"
        d="M9.16663 5.3861V13.7194C9.16663 13.9404 9.25442 14.1524 9.4107 14.3087C9.56698 14.465 9.77895 14.5528 9.99996 14.5528C10.221 14.5528 10.4329 14.465 10.5892 14.3087C10.7455 14.1524 10.8333 13.9404 10.8333 13.7194V5.3861C10.8333 5.16508 10.7455 4.95312 10.5892 4.79684C10.4329 4.64056 10.221 4.55276 9.99996 4.55276C9.77895 4.55276 9.56698 4.64056 9.4107 4.79684C9.25442 4.95312 9.16663 5.16508 9.16663 5.3861Z"
      />
      <path
        className="fill-current"
        d="M12.5 7.05278V13.7194C12.5 13.9405 12.5878 14.1524 12.7441 14.3087C12.9004 14.465 13.1123 14.5528 13.3333 14.5528C13.5543 14.5528 13.7663 14.465 13.9226 14.3087C14.0789 14.1524 14.1667 13.9405 14.1667 13.7194V7.05278C14.1667 6.83177 14.0789 6.61981 13.9226 6.46353C13.7663 6.30725 13.5543 6.21945 13.3333 6.21945C13.1123 6.21945 12.9004 6.30725 12.7441 6.46353C12.5878 6.61981 12.5 6.83177 12.5 7.05278Z"
      />
      <path
        className="fill-current"
        d="M15.8334 2.8861V13.7194C15.8334 13.9404 15.9212 14.1524 16.0775 14.3087C16.2337 14.465 16.4457 14.5528 16.6667 14.5528C16.8877 14.5528 17.0997 14.465 17.256 14.3087C17.4122 14.1524 17.5 13.9404 17.5 13.7194V2.8861C17.5 2.66508 17.4122 2.45312 17.256 2.29684C17.0997 2.14056 16.8877 2.05276 16.6667 2.05276C16.4457 2.05276 16.2337 2.14056 16.0775 2.29684C15.9212 2.45312 15.8334 2.66508 15.8334 2.8861Z"
      />
    </svg>
  ),
  bill: (props: IconProps) => (
    <svg 
      id="icon"
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="21" 
      viewBox="0 0 24 24"
      {...props}>
      <g 
        fill="none" 
        fillRule="evenodd">
        <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/>
        <path fill="currentColor" d="M3 5.5A2.5 2.5 0 0 1 5.5 3H18a3 3 0 0 1 3 3v14a1 1 0 0 1-1.524.852l-2.726-1.678l-2.726 1.678a1 1 0 0 1-1.048 0l-2.726-1.678l-2.726 1.678A1 1 0 0 1 6 20v-6H4a1 1 0 0 1-1-1zm5 12.71l1.726-1.062a1 1 0 0 1 1.048 0l2.726 1.678l2.726-1.678a1 1 0 0 1 1.048 0L19 18.21V6a1 1 0 0 0-1-1H7.95q.05.243.05.5zM5.5 5a.5.5 0 0 0-.5.5V12h1V5.5a.5.5 0 0 0-.5-.5M10 9a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2h-5a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1"/>
      </g>
    </svg>
  ),
};
