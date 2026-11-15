// Test environment shims (jsdom lacks TextEncoder, which jsPDF needs)
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;
