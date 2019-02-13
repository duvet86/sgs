export default class Mat3
    {
        public m00: number = 0;
        public m01: number = 0;
        public m02: number = 0;
        public m10: number = 0;
        public m11: number = 0;
        public m12: number = 0;
        public m20: number = 0;
        public m21: number = 0;
        public m22: number = 0;

        void clear() ;
        void set(const float m00, const float m01, const float m02,
                 const float m10, const float m11, const float m12,
                 const float m20, const float m21, const float m22) ;
        void set(const Mat3 &rhs) ;
        void setSymmetric(const float a00, const float a01, const float a02,
                          const float a11, const float a12, const float a22) ;
        void setSymmetric(const SMat3 &rhs);
    }