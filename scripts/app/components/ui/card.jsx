'use client';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { motion } from 'framer-motion';
import { cn } from '@/app/lib/utils';
export function Card(_a) {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (<motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }} className={cn('rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all', className)} {...props}>
      {children}
    </motion.div>);
}
export function CardHeader(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (<div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}/>);
}
export function CardTitle(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (<h3 className={cn('text-xl font-semibold tracking-tight text-black', className)} {...props}/>);
}
export function CardDescription(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (<p className={cn('text-sm text-gray-600', className)} {...props}/>);
}
export function CardContent(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (<div className={cn('pt-0', className)} {...props}/>);
}
export function CardFooter(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (<div className={cn('flex items-center pt-4', className)} {...props}/>);
}
