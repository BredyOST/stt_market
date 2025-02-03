// import React, { useState, useEffect, lazy, Suspense } from "react";
// import {ICONS_TOKENS} from "../../shared/const/index.const";
//
//
// const TokenIcon = ({ token }: { token: string }) => {
//     const [SvgComponent, setSvgComponent] = useState<React.FC | null>(null);
//
//     useEffect(() => {
//         if (ICONS_TOKENS[token]) {
//             ICONS_TOKENS[token]().then((module) => {
//                 setSvgComponent(() => module.ReactComponent);
//             });
//         }
//     }, [token]);
//
//     if (!SvgComponent) return <div style={{ width: 24, height: 24 }} />; // Заглушка, пока грузится
//
//     return (
//         <Suspense fallback={<div style={{ width: 24, height: 24 }} />}>
//             <SvgComponent/>
//         </Suspense>
//     );
// };
//
// export default TokenIcon;
